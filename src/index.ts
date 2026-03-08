#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

interface AnalysisResult {
  score: number;
  strength: number;
  clarity: number;
  completeness: number;
  recommendations: Array<{ type: string; detail: string }>;
}

const BEST_PRACTICES = [
  { pattern: /task name:?\s*/i, weight: 10, detail: 'Add a clear task name' },
  { pattern: /input:?\s*/i, weight: 15, detail: 'Define input parameters clearly' },
  { pattern: /output:?\s*/i, weight: 15, detail: 'Specify output format' },
  { pattern: /context:?\s*/i, weight: 10, detail: 'Provide relevant context' },
  { pattern: /constraints?:?\s*/i, weight: 10, detail: 'Add constraints or limitations' },
  { pattern: /examples?:?\s*/i, weight: 10, detail: 'Include examples for clarity' },
  { pattern: /tone:?\s*/i, weight: 5, detail: 'Specify tone/style preferences' },
  { pattern: /audience:?\s*/i, weight: 5, detail: 'Define target audience' },
  { pattern: /\d+\s*(word| sentence| paragraph)/i, weight: 10, detail: 'Add length constraints' },
  { pattern: /step[s]?\s*\d+/i, weight: 10, detail: 'Break into numbered steps' },
];

const VAGUENESS_PATTERNS = [
  { pattern: /\b(good|great|awesome|amazing)\b/i, penalty: 5, detail: 'Be specific instead of using vague adjectives' },
  { pattern: /\b(something|anything|everything)\b/i, penalty: 10, detail: 'Be more specific about what you want' },
  { pattern: /\bmaybe\b/i, penalty: 5, detail: 'Make instructions definitive' },
  { pattern: /\btry to\b/i, penalty: 5, detail: 'Use direct commands instead of "try to"' },
];

function analyzePrompt(prompt: string): AnalysisResult {
  const lines = prompt.split('\n').filter(l => l.trim());
  
  let strength = 50;
  let clarity = 50;
  let completeness = 30;
  const recommendations: Array<{ type: string; detail: string }> = [];

  // Check for task specification
  const hasTaskName = /task name:?\s*/i.test(prompt);
  const hasInput = /input:?\s*/i.test(prompt);
  const hasOutput = /output:?\s*/i.test(prompt);
  
  if (hasTaskName) {
    strength += 15;
    completeness += 10;
  } else {
    recommendations.push({ type: 'structure', detail: 'Add a Task Name section' });
  }
  
  if (hasInput) {
    clarity += 15;
    completeness += 15;
  } else {
    recommendations.push({ type: 'clarity', detail: 'Add an Input section describing what you will provide' });
  }
  
  if (hasOutput) {
    clarity += 20;
    completeness += 15;
  } else {
    recommendations.push({ type: 'format', detail: 'Add an Output section with desired format' });
  }

  // Check best practices
  for (const practice of BEST_PRACTICES) {
    if (practice.pattern.test(prompt)) {
      strength += practice.weight;
    } else {
      recommendations.push({ type: 'best_practice', detail: practice.detail });
    }
  }

  // Check for vagueness
  for (const vague of VAGUENESS_PATTERNS) {
    if (vague.pattern.test(prompt)) {
      strength -= vague.penalty;
      recommendations.push({ type: 'vagueness', detail: vague.detail });
    }
  }

  // Check for clear action verbs
  const actionVerbs = /\b(write|create|generate|analyze|list|explain|describe|summarize)\b/i;
  if (actionVerbs.test(prompt)) {
    clarity += 10;
  } else {
    recommendations.push({ type: 'action', detail: 'Start with clear action verbs (write, create, generate, etc.)' });
  }

  // Calculate final score
  const score = Math.min(100, Math.max(0, Math.round((strength + clarity + completeness) / 3)));

  return {
    score,
    strength: Math.min(100, Math.max(0, strength)),
    clarity: Math.min(100, Math.max(0, clarity)),
    completeness: Math.min(100, Math.max(0, completeness)),
    recommendations: recommendations.slice(0, 5)
  };
}

function main() {
  const program = new Command();
  
  program
    .name('ai-prompt-optimizer')
    .description('Analyze and optimize AI prompts for better results')
    .version('1.0.0');

  program
    .command('analyze')
    .description('Analyze a prompt')
    .argument('<prompt>', 'The prompt to analyze')
    .action((prompt: string) => {
      const result = analyzePrompt(prompt);
      
      console.log('\n📊 Prompt Analysis Results\n');
      console.log(`Overall Score: ${result.score}/100\n`);
      
      console.log('Scores by Dimension:');
      console.log(`  - Strength: ${result.strength}/100`);
      console.log(`  - Clarity: ${result.clarity}/100`);
      console.log(`  - Completeness: ${result.completeness}/100\n`);
      
      if (result.recommendations.length > 0) {
        console.log('📋 Recommendations:');
        for (const rec of result.recommendations) {
          console.log(`  • [${rec.type}] ${rec.detail}`);
        }
      }
    });

  program
    .command('optimize')
    .description('Interactive prompt optimizer')
    .action(() => {
      console.log('\n🎯 AI Prompt Optimizer - Interactive Mode\n');
      console.log('Paste your prompt below (Ctrl+D when done):\n');
      
      let prompt = '';
      process.stdin.on('data', (chunk) => {
        prompt += chunk;
      });
      
      process.stdin.on('end', () => {
        const result = analyzePrompt(prompt);
        
        console.log('\n📊 Analysis Results\n');
        console.log(`Overall Score: ${result.score}/100\n`);
        
        console.log('Scores by Dimension:');
        console.log(`  - Strength: ${result.strength}/100`);
        console.log(`  - Clarity: ${result.clarity}/100`);
        console.log(`  - Completeness: ${result.completeness}/100\n`);
        
        if (result.recommendations.length > 0) {
          console.log('📋 Recommendations:');
          for (const rec of result.recommendations) {
            console.log(`  • [${rec.type}] ${rec.detail}`);
          }
        }
      });
    });

  program.parse();
}

main();
