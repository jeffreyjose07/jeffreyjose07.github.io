import { Linkedin, Github, Mail } from "lucide-react";

export interface SocialLink {
  icon: typeof Linkedin;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/jeffrey-jose-07-k/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/jeffreyjose07", label: "GitHub" },
  { icon: Mail, href: "mailto:jeffreyjose.k@gmail.com", label: "Email" },
];
