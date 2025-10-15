---
title: "solving adjacent increasing subarrays: from naive to optimal"
date: "2025-01-26"
tags: ["algorithms", "optimization", "leetcode", "data-structures", "problem-solving"]
description: "A deep dive into algorithm optimization - from O(n³) brute force to O(n) optimal solution with interactive visualization"
readingTime: 10
wordCount: 2000
inlineStyles: |
  /* Visualization styles adapted to terminal aesthetic */
  .viz-container {
      margin: 32px 0;
      border: 1px solid #333333;
      border-radius: 4px;
      padding: 24px;
      background-color: #0a0a0a;
  }

  .array-container {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin: 24px 0;
      flex-wrap: wrap;
  }

  .array-item {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #333333;
      border-radius: 3px;
      font-weight: 600;
      font-size: 16px;
      background: #000000;
      color: #c9c9c9;
      transition: all 0.2s ease;
      position: relative;
  }

  .array-item.current {
      background: #1a1a00;
      border-color: #ffff55;
      color: #ffff55;
  }

  .array-item.current-run {
      background: #001a00;
      border-color: #55ff55;
      color: #55ff55;
  }

  .array-item.previous-run {
      background: #1a0000;
      border-color: #ff5555;
      color: #ff5555;
  }

  .array-item .index {
      position: absolute;
      top: -18px;
      font-size: 11px;
      color: #666666;
      font-weight: normal;
  }

  .state-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 24px 0;
  }

  .state-box {
      background: #000000;
      border: 1px solid #333333;
      padding: 16px;
      border-radius: 3px;
  }

  .state-box h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #55ffff;
  }

  .state-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
  }

  .state-label {
      color: #888888;
  }

  .state-value {
      font-weight: 600;
      color: #55ff55;
  }

  .explanation {
      background: #000000;
      border: 1px solid #333333;
      padding: 16px;
      border-radius: 3px;
      margin: 16px 0;
  }

  .explanation h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #ff55ff;
  }

  .explanation p {
      margin: 0;
      font-size: 14px;
      color: #c9c9c9;
  }

  .scenario-box {
      background: #000000;
      border: 1px solid #333333;
      padding: 12px;
      border-radius: 3px;
      margin: 8px 0;
      font-size: 14px;
  }

  .scenario-box.winning {
      border-color: #55ff55;
      background: #001a00;
  }

  .scenario-title {
      font-weight: 600;
      color: #55ffff;
      margin-bottom: 6px;
  }

  .scenario-box div {
      color: #888888;
  }

  .scenario-box.winning .winner-badge {
      color: #55ff55;
      font-weight: 600;
      margin-top: 6px;
  }

  .controls {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 24px 0;
      flex-wrap: wrap;
  }

  .viz-container button {
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      border: 1px solid #333333;
      border-radius: 3px;
      cursor: pointer;
      background-color: #0a0a0a;
      color: #55ff55;
      transition: all 0.2s ease;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .viz-container button:hover {
      background-color: #1a1a1a;
      border-color: #55ff55;
  }

  .viz-container button:disabled {
      color: #333333;
      border-color: #222222;
      cursor: not-allowed;
  }

  .result-box {
      background: #001a00;
      border: 1px solid #55ff55;
      border-radius: 3px;
      padding: 16px;
      text-align: center;
      margin-top: 16px;
      display: none;
  }

  .result-box.show {
      display: block;
  }

  .result-box h3 {
      color: #55ff55;
      margin: 0 0 8px 0;
      font-size: 16px;
  }

  .input-section {
      background: #000000;
      border: 1px solid #333333;
      padding: 16px;
      border-radius: 3px;
      margin-bottom: 16px;
  }

  .input-section label {
      display: block;
      text-align: center;
      color: #55ffff;
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 14px;
  }

  .input-group {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
  }

  .viz-container input[type="text"] {
      padding: 6px 12px;
      font-size: 14px;
      line-height: 20px;
      color: #55ff55;
      background-color: #000000;
      border: 1px solid #333333;
      border-radius: 3px;
      outline: none;
      width: 280px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .viz-container input[type="text"]:focus {
      border-color: #55ff55;
      box-shadow: 0 0 0 2px rgba(85, 255, 85, 0.2);
  }

  .error-message {
      color: #ff5555;
      text-align: center;
      margin-top: 8px;
      font-size: 12px;
  }

  .presets {
      text-align: center;
      color: #888888;
      font-size: 12px;
      margin-top: 8px;
  }

  .presets a {
      color: #55ffff;
      text-decoration: none;
  }

  .presets a:hover {
      text-decoration: underline;
  }

  @media (max-width: 767px) {
      .state-container {
          grid-template-columns: 1fr;
      }
      .viz-container input[type="text"] {
          width: 100%;
      }
  }
inlineScripts: |
  let nums = [2, 5, 7, 8, 9, 2, 3, 4, 3, 1];
  let i = 1;
  let currentRunLength = 1;
  let previousRunLength = 0;
  let maxK = 0;
  let isPlaying = false;

  function loadCustomArray() {
      const input = document.getElementById('arrayInput').value.trim();

      const existingError = document.querySelector('.error-message');
      if (existingError) existingError.remove();

      if (!input) {
          showError('please enter an array');
          return;
      }

      const parsed = input.split(',').map(s => s.trim()).filter(s => s !== '');

      if (parsed.length < 2) {
          showError('array must have at least 2 elements');
          return;
      }

      if (parsed.length > 10) {
          showError('array must have at most 10 elements');
          return;
      }

      const numbers = [];
      for (let val of parsed) {
          const num = parseInt(val);
          if (isNaN(num)) {
              showError(`"${val}" is not a valid number`);
              return;
          }
          numbers.push(num);
      }

      nums = numbers;
      reset();

      const inputSection = document.querySelector('.input-section');
      const successMsg = document.createElement('p');
      successMsg.className = 'error-message';
      successMsg.style.color = '#55ff55';
      successMsg.textContent = 'array loaded';
      inputSection.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 2000);
  }

  function showError(message) {
      const inputSection = document.querySelector('.input-section');
      const errorMsg = document.createElement('p');
      errorMsg.className = 'error-message';
      errorMsg.textContent = message;
      inputSection.appendChild(errorMsg);
  }

  function initArray() {
      const container = document.getElementById('arrayContainer');
      container.innerHTML = '';
      nums.forEach((num, idx) => {
          const div = document.createElement('div');
          div.className = 'array-item';
          div.id = `item-${idx}`;
          div.innerHTML = `<span class="index">${idx}</span>${num}`;
          if (idx === 0) {
              div.classList.add('current-run');
          }
          container.appendChild(div);
      });
  }

  function updateDisplay() {
      document.getElementById('position').textContent = i;
      document.getElementById('currentRun').textContent = currentRunLength;
      document.getElementById('previousRun').textContent = previousRunLength;
      document.getElementById('maxK').textContent = maxK;

      for (let j = 0; j < nums.length; j++) {
          const item = document.getElementById(`item-${j}`);
          item.classList.remove('current', 'current-run', 'previous-run');

          if (j === i) {
              item.classList.add('current');
          } else {
              if (j <= i && j > i - currentRunLength) {
                  item.classList.add('current-run');
              }
              if (previousRunLength > 0 && j < i - currentRunLength + 1 && j >= i - currentRunLength - previousRunLength + 1) {
                  item.classList.add('previous-run');
              }
          }
      }
  }

  function step() {
      if (i >= nums.length) {
          showResult();
          return;
      }

      const isIncreasing = nums[i] > nums[i - 1];

      if (isIncreasing) {
          currentRunLength++;
          document.getElementById('explanation').innerHTML =
              `position ${i}: ${nums[i]} > ${nums[i-1]}<br>sequence continues. current run: ${currentRunLength}`;
      } else {
          previousRunLength = currentRunLength;
          currentRunLength = 1;
          document.getElementById('explanation').innerHTML =
              `position ${i}: ${nums[i]} ≤ ${nums[i-1]}<br>sequence breaks. previous run: ${previousRunLength}, starting new`;
      }

      const kFromTwoRuns = Math.min(previousRunLength, currentRunLength);
      const kFromSplittingRun = Math.floor(currentRunLength / 2);

      const prevMaxK = maxK;
      maxK = Math.max(maxK, kFromTwoRuns, kFromSplittingRun);

      const scenariosDiv = document.getElementById('scenarios');
      scenariosDiv.innerHTML = `
          <div class="scenario-box ${kFromTwoRuns === maxK && kFromTwoRuns > prevMaxK ? 'winning' : ''}">
              <div class="scenario-title">scenario 1: bridge two runs</div>
              <div>min(${previousRunLength}, ${currentRunLength}) = ${kFromTwoRuns}</div>
              ${kFromTwoRuns === maxK && kFromTwoRuns > prevMaxK ? '<div class="winner-badge">✓ new maximum</div>' : ''}
          </div>
          <div class="scenario-box ${kFromSplittingRun === maxK && kFromSplittingRun > prevMaxK ? 'winning' : ''}">
              <div class="scenario-title">scenario 2: split current run</div>
              <div>${currentRunLength} / 2 = ${kFromSplittingRun}</div>
              ${kFromSplittingRun === maxK && kFromSplittingRun > prevMaxK ? '<div class="winner-badge">✓ new maximum</div>' : ''}
          </div>
      `;

      updateDisplay();
      i++;

      if (i >= nums.length) {
          document.getElementById('stepBtn').disabled = true;
          showResult();
      }
  }

  function showResult() {
      const resultBox = document.getElementById('resultBox');
      const resultText = document.getElementById('resultText');
      resultBox.classList.add('show');
      resultText.innerHTML = `maximum k = ${maxK}`;
  }

  function reset() {
      i = 1;
      currentRunLength = 1;
      previousRunLength = 0;
      maxK = 0;
      isPlaying = false;
      document.getElementById('stepBtn').disabled = false;
      document.getElementById('resultBox').classList.remove('show');
      document.getElementById('scenarios').innerHTML = '';
      document.getElementById('explanation').textContent = 'click next step to begin';
      initArray();
      updateDisplay();
  }

  async function autoPlay() {
      if (isPlaying) return;
      isPlaying = true;

      while (i < nums.length && isPlaying) {
          step();
          await new Promise(resolve => setTimeout(resolve, 1500));
      }

      isPlaying = false;
  }

  // Initialize on page load
  setTimeout(() => {
      initArray();
      updateDisplay();
  }, 500);
---

When I first encountered this problem on **LeetCode**, I did what most developers do - jumped straight to the naive solution. What followed was a journey through increasingly elegant **optimizations**, each revealing deeper insights about algorithmic thinking. This documents that evolution from a working-but-slow O(n³) solution to an optimal O(n) **algorithm**.

## the problem

Given an **array** of integers, find the maximum value of `k` for which there exist two adjacent subarrays of length `k` each, where both subarrays are strictly increasing.

**Constraints:**
- Both subarrays must be strictly increasing
- The subarrays must be adjacent
- **Array** length can be up to 200,000 elements

**Example:**
```
nums = [2,5,7,8,9,2,3,4,3,1]
output = 3

The subarray [7,8,9] is strictly increasing
The subarray [2,3,4] is strictly increasing
They are adjacent, and k=3 is the maximum
```

## the naive approach

The straightforward solution: try every possible value of k, check every possible window, and verify if both halves are increasing.

```cpp
class Solution {
public:
    bool isStrictlyIncreasing(vector<int>& nums, int start, int length) {
        for (int i = start + 1; i < start + length; i++) {
            if (nums[i] <= nums[i-1]) return false;
        }
        return true;
    }

    int maxIncreasingSubarrays(vector<int>& nums) {
        int n = nums.size();

        for (int k = n/2; k >= 1; k--) {
            for (int i = 0; i <= n - 2*k; i++) {
                if (isStrictlyIncreasing(nums, i, k) &&
                    isStrictlyIncreasing(nums, i + k, k)) {
                    return k;
                }
            }
        }
        return 0;
    }
};
```

**Time complexity:** O(n² × k) ≈ O(n³)
**Space complexity:** O(1)

With n = 200,000, this times out immediately.

## first optimization: precomputation

The naive solution repeatedly checks if subarrays are increasing. The key insight: **precompute** how long each increasing sequence is.

### run length array

```
nums      = [2, 5, 7, 8, 9, 2, 3, 4, 3, 1]
runLength = [1, 2, 3, 4, 5, 1, 2, 3, 1, 1]
```

At index 4, `runLength[4] = 5` means there's an increasing sequence of length 5 ending at position 4.

```cpp
class Solution {
public:
    int maxIncreasingSubarrays(vector<int>& nums) {
        int n = nums.size();
        vector<int> runLength(n, 1);

        for (int i = 1; i < n; i++) {
            if (nums[i] > nums[i-1]) {
                runLength[i] = runLength[i-1] + 1;
            }
        }

        int maxK = 0;
        for (int i = 0; i < n - 1; i++) {
            for (int k = 1; k <= (n - i) / 2; k++) {
                if (runLength[i + k - 1] >= k &&
                    runLength[i + 2*k - 1] >= k) {
                    maxK = max(maxK, k);
                }
            }
        }

        return maxK;
    }
};
```

**Time complexity:** O(n²)
**Space complexity:** O(n)

Better, but still quadratic. With n = 200,000, we're at 40 billion **operations**.

## the optimal solution

The breakthrough: at any point in the **array**, there are exactly two ways to form adjacent increasing subarrays.

### scenario 1: bridge two separate runs

```
Previous Run          Current Run
[...........] [break] [...........]
   length=A              length=B

maximum k = min(A, B)
```

### scenario 2: split a single run

```
One Long Run
[........................]
        length=L

maximum k = L / 2
```

### the algorithm

```cpp
class Solution {
public:
    int maxIncreasingSubarrays(vector<int>& nums) {
        int n = nums.size();

        int currentRunLength = 1;
        int previousRunLength = 0;
        int maxK = 0;

        for (int i = 1; i < n; i++) {
            if (nums[i] > nums[i - 1]) {
                currentRunLength++;
            } else {
                previousRunLength = currentRunLength;
                currentRunLength = 1;
            }

            int kFromTwoRuns = min(previousRunLength, currentRunLength);
            int kFromSplittingRun = currentRunLength / 2;

            maxK = max({maxK, kFromTwoRuns, kFromSplittingRun});
        }

        return maxK;
    }
};
```

**Time complexity:** O(n)
**Space complexity:** O(1)

Single pass, constant space.

## the visualization

<div class="viz-container">
    <div class="input-section">
        <label>enter an array (max 10 numbers, comma-separated)</label>
        <div class="input-group">
            <input type="text" id="arrayInput" placeholder="2,5,7,8,9,2,3,4,3,1"
                   onkeypress="if(event.key==='Enter') loadCustomArray()">
            <button onclick="loadCustomArray()">load</button>
        </div>
        <div class="presets">
            <a href="#" onclick="document.getElementById('arrayInput').value='1,2,3,4,5,6,7,8'; loadCustomArray(); return false;">split run example</a> |
            <a href="#" onclick="document.getElementById('arrayInput').value='1,2,3,4,4,4,4,5,6,7'; loadCustomArray(); return false;">bridge runs example</a>
        </div>
    </div>
    <div class="array-container" id="arrayContainer"></div>
    <div class="state-container">
        <div class="state-box">
            <h4>current state</h4>
            <div class="state-item">
                <span class="state-label">position</span>
                <span class="state-value" id="position">0</span>
            </div>
            <div class="state-item">
                <span class="state-label">current run</span>
                <span class="state-value" id="currentRun">1</span>
            </div>
            <div class="state-item">
                <span class="state-label">previous run</span>
                <span class="state-value" id="previousRun">0</span>
            </div>
        </div>
        <div class="state-box">
            <h4>maximum k</h4>
            <div style="text-align: center; padding: 12px 0;">
                <span class="state-value" id="maxK" style="font-size: 32px;">0</span>
            </div>
        </div>
    </div>
    <div class="explanation">
        <h4>what's happening</h4>
        <p id="explanation">click next step to begin</p>
    </div>
    <div id="scenarios"></div>
    <div class="controls">
        <button onclick="reset()">reset</button>
        <button id="stepBtn" onclick="step()">next step</button>
        <button onclick="autoPlay()">auto play</button>
    </div>
    <div class="result-box" id="resultBox">
        <h3>algorithm complete</h3>
        <p id="resultText"></p>
    </div>
</div>

## complexity comparison

| approach | time | space |
|----------|------|-------|
| naive | O(n³) | O(1) |
| precomputation | O(n²) | O(n) |
| optimal | O(n) | O(1) |

## lessons learned

**start simple** - The naive solution helped understand the problem deeply.

**precomputation is powerful** - When repeating calculations, precompute them.

**state tracking enables single passes** - Track just enough **state** to make decisions without looking back.

**pattern recognition matters** - Recognizing there are exactly two ways to form the answer unlocks the O(n) solution.

This problem taught me that **optimization** isn't just about making code faster - it's about understanding the problem structure deeply enough to see elegant solutions. The journey from O(n³) to O(n) wasn't just about removing loops; it was about recognizing fundamental **patterns** in the problem itself.
