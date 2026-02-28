import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentPath = path.resolve('content.md');

export interface WritingEntry {
  title: string;
  date: string;
  outlet?: string;
  url?: string;
  description?: string;
  featured?: boolean;
}

export interface Project {
  title: string;
  description: string;
  url?: string;
  tags: string[];
}

export interface SpeakingEntry {
  title: string;
  date: string;
  event: string;
  venue?: string;
  role?: string;
  url?: string;
  type: 'speaking' | 'press';
  description?: string;
}

export interface FocusItem {
  text: string;
  linkText?: string;
  link?: string;
  suffix?: string;
}

export interface Education {
  degree: string;
  school: string;
  year: number;
  focus?: string;
}

export interface Social {
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface SiteContent {
  name: string;
  tagline: string;
  intro: string;
  currentFocus: FocusItem[];
  writing: WritingEntry[];
  projects: Project[];
  speaking: SpeakingEntry[];
  education: Education[];
  social: Social;
  aboutHtml: string;
}

let cached: SiteContent | null = null;

export function getSiteContent(): SiteContent {
  if (cached && import.meta.env.PROD) return cached;

  const raw = fs.readFileSync(contentPath, 'utf-8');
  const { data, content } = matter(raw);

  // Convert markdown body to HTML for the about page
  // Use a simple markdown-to-html conversion for the about section
  const aboutHtml = markdownToHtml(content);

  cached = {
    name: data.name,
    tagline: data.tagline,
    intro: data.intro,
    currentFocus: data.currentFocus || [],
    writing: (data.writing || []).map((w: any) => ({
      ...w,
      date: typeof w.date === 'object' ? w.date.toISOString() : w.date,
    })),
    projects: data.projects || [],
    speaking: (data.speaking || []).map((s: any) => ({
      ...s,
      date: typeof s.date === 'object' ? s.date.toISOString() : s.date,
    })),
    education: data.education || [],
    social: data.social || {},
    aboutHtml,
  };

  return cached;
}

// Simple markdown to HTML converter for the about page body
function markdownToHtml(md: string): string {
  let html = md.trim();

  // Convert markdown links [text](url) to <a> tags
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Convert **bold** to <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to <em>
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Convert ## headings to <h2>
  html = html.replace(/^## (.+)$/gm, '</p><h2>$1</h2><p>');

  // Convert paragraphs (double newlines)
  html = html
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h2>') || block.startsWith('</p><h2>')) return block;
      return `<p>${block}</p>`;
    })
    .join('\n');

  // Clean up any empty <p></p> or </p><p> artifacts
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/^<\/p>/, '');
  html = html.replace(/<p>$/g, '');

  return html;
}
