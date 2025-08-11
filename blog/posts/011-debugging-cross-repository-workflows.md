---
title: "Debugging Cross-Repository GitHub Actions: A Void Blocks Tale"
slug: "debugging-cross-repository-workflows"
date: "2025-08-11"
tags: ["github-actions", "automation", "debugging", "devops", "ci-cd"]
description: "A deep dive into the complex world of cross-repository workflows, race conditions, and permission errors I encountered while deploying my Void Blocks game."
---

I recently embarked on a journey to automate the deployment of my `void-blocks-game` to my personal portfolio website. The goal was simple: push a change to the game's repository, and have it automatically build, deploy, and appear on my portfolio site. What followed was a fascinating and frustrating deep dive into the world of cross-repository GitHub Actions, race conditions, and permission errors.

## the initial setup

The plan was to have two repositories working in concert:

1.  **`void-blocks-game`**: The repository for the game itself. A push to this repository would trigger a build process.
2.  **`jeffreyjose07.github.io`**: My personal portfolio website, which would host the game.

The idea was to have a GitHub Actions workflow in the `void-blocks-game` repository that would build the game and then push the build artifacts to the `jeffreyjose07.github.io` repository. This, in turn, would trigger another workflow in the portfolio repository to rebuild the site and deploy the new version of the game.

## the first hurdle: the race condition

The initial implementation seemed straightforward. The `void-blocks-game` workflow would push the game's build to the `public/games/void-blocks` directory in the portfolio's `main` branch. Simultaneously, it would dispatch a `repository_dispatch` event to trigger the portfolio's rebuild workflow.

The problem? A classic race condition. The portfolio's rebuild workflow would start at the same time as the game's build was being pushed. More often than not, the portfolio would build *before* the new game files were available, resulting in no change to the live site.

My first attempt at a solution was to introduce a delay in the portfolio's rebuild workflow:

```yaml
- name: Wait for game files to be pushed
  run: sleep 30s
```

This was a simple, if not elegant, solution. It worked, but it felt like a hack. There had to be a better way.

## the second hurdle: permissions

The next problem was more insidious. The portfolio's rebuild workflow was failing with a permission error:

`remote: Permission to jeffreyjose07/jeffreyjose07.github.io.git denied to github-actions[bot].`

The `GITHUB_TOKEN` used in the workflow didn't have the necessary permissions to push to the `main` branch. This is because workflows triggered by `repository_dispatch` events have read-only permissions by default.

The fix was to explicitly grant write permissions to the workflow:

```yaml
jobs:
  rebuild-portfolio:
    permissions: write-all
    runs-on: ubuntu-latest
```

This was a crucial lesson in the security model of GitHub Actions.

## the third hurdle: the missing lock file

Even with the permissions fixed, the `void-blocks-game` workflow started failing. The error was in the `Setup Node.js` step:

`##[error]Dependencies lock file is not found...`

The `actions/setup-node@v4` action was configured to use a cache for `npm`, but it couldn't find a `package-lock.json` file. I had forgotten to commit the lock file to the repository.

A quick `npm install` and a commit of the `package-lock.json` file fixed this issue.

## the final solution: a robust workflow

After a lot of trial and error, I arrived at a solution that is both robust and elegant.

The `void-blocks-game` workflow now builds the game and pushes the artifacts to the portfolio repository. It then triggers the portfolio's rebuild workflow using `repository_dispatch`.

The portfolio's rebuild workflow, now with the correct permissions and a delay, pulls the latest changes, rebuilds the site, and commits the changes to the `main` branch. This final push then triggers the `deploy.yml` workflow, which handles the deployment to GitHub Pages.

Here's a look at the key parts of the final workflows:

**`void-blocks-game/.github/workflows/build-and-deploy.yml`**
```yaml
- name: Deploy to Portfolio Repository
  uses: peaceiris/actions-gh-pages@v4
  with:
    personal_token: ${{ secrets.PORTFOLIO_DEPLOY_TOKEN }}
    external_repository: jeffreyjose07/jeffreyjose07.github.io
    publish_dir: ./dist
    destination_dir: public/games/void-blocks
    publish_branch: main
    keep_files: true

- name: Trigger Portfolio Rebuild
  uses: peter-evans/repository-dispatch@v3
  with:
    token: ${{ secrets.PORTFOLIO_DEPLOY_TOKEN }}
    repository: jeffreyjose07/jeffreyjose07.github.io
    event-type: game-updated
```

**`jeffreyjose07.github.io/.github/workflows/rebuild-on-game-update.yml`**
```yaml
permissions:
  contents: write

jobs:
  rebuild-portfolio:
    runs-on: ubuntu-latest
    steps:
    - name: Wait for game files to be pushed
      run: sleep 30s

    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Commit and push changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add -A
        git commit -m "Rebuild portfolio after game update: ${{ github.event.client_payload.game }}" || echo "No changes to commit"
        git push
```

## lessons learned

This experience taught me a lot about the intricacies of GitHub Actions:

*   **Race conditions are real:** When dealing with multiple workflows that interact with each other, it's important to consider the timing of events.
*   **Permissions are key:** Always check the permissions of the `GITHUB_TOKEN` in your workflows, especially when dealing with `repository_dispatch` events.
*   **Lock files are important:** Always commit your lock files to ensure reproducible builds.
*   **Iterate and learn:** Don't be afraid to try different solutions and learn from your mistakes.

In the end, I was able to build a fully automated deployment pipeline that is both reliable and efficient. The journey was challenging, but the result was well worth the effort.
