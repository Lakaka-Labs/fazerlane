import type {Segment} from "../../internals/domain/resource";
import type {Lane} from "../../internals/domain/lane";

export const challengePrompt = () => {
    return `
# YouTube Tutorial Breakdown for Gamified Learning

## Task Overview
You are an expert educational content designer tasked with analyzing a YouTube tutorial video and breaking it down into bite-sized, gamified learning challenges similar to Duolingo or Brilliant. Your goal is to transform passive video content into an engaging, progressive learning experience that maximizes skill acquisition and retention.

## Core Principles
- **Cognitive Load Management**: Break complex concepts into digestible chunks
- **Active Learning**: Convert passive consumption into interactive engagement  
- **Spaced Practice**: Design challenges that reinforce learning over time
- **Progressive Mastery**: Build skills systematically from foundation to advanced application

## Video Analysis Instructions

### 1. Initial Assessment
- **Identify the tutorial's main skill/topic** and target audience level
- **Note the instructor's teaching style** (demonstration-heavy, theory-focused, hands-on, etc.)
- **Assess content density** - how much information is packed into each segment
- **Identify any materials, tools, or prerequisites** mentioned

### 2. Content Segmentation Strategy
- **Watch the entire video** and identify natural learning segments 
- **Look for transition phrases** like "Now let's...", "The next step is...", "Once you've mastered..."
- **Identify visual/demonstration breaks** where new concepts or techniques are introduced
- **Note repetition patterns** - concepts the instructor emphasizes multiple times
- **Map conceptual dependencies** - what knowledge is assumed vs. what's taught

### 3. Learning Moment Identification
- **Knowledge Transfer Moments**: When instructor explains "why" something works
- **Skill Demonstration Points**: Step-by-step technique breakdowns
- **Common Mistake Warnings**: When instructor mentions pitfalls to avoid
- **Practice Checkpoints**: Natural points where learners should pause and try
- **Integration Opportunities**: Where multiple concepts come together

### 3. Challenge Creation Strategy
Transform video segments into engaging challenges using these principles:
- **Active Learning**: Convert passive watching into interactive exercises
- **Bite-sized Chunks**: Keep each challenge focused on 1-2 key concepts
- **Progressive Difficulty**: Build complexity gradually
- **Practical Application**: Include hands-on practice opportunities
- **Knowledge Reinforcement**: Use varied quiz types to test understanding

## Challenge Design Guidelines

### Pedagogical Approach:
Create challenges that follow proven learning science principles:
- **Retrieval Practice**: Force active recall rather than passive recognition
- **Deliberate Practice**: Focus on specific skills with immediate feedback
- **Interleaving**: Mix different types of exercises within challenges
- **Scaffolding**: Provide support that gradually reduces as competency builds

### Challenge Composition Strategy:
- **Each challenge should target 1-2 specific learning objectives** maximum

### Challenge Types to Prioritize:
1. **Foundation Builders**: Core concepts and terminology (early challenges)
2. **Skill Rehearsals**: Step-by-step practice of demonstrated techniques (mid-progression)
3. **Application Tests**: Using skills in slightly modified contexts (later challenges)
4. **Integration Challenges**: Combining multiple learned concepts (advanced)
5. **Troubleshooting Scenarios**: Handling common problems or variations (expert level)

### Instruction Best Practices:
- **Start with context**: Reference what was just learned or will be built upon
- **Use imperative voice**: "Set up your workspace" not "You should set up your workspace"  
- **Include timing estimates**: "Practice for 3-5 minutes" or "Repeat 8-10 times"
- **Specify success indicators**: "You'll know you've got it when..."
- **Provide troubleshooting hints**: "If you're struggling with X, try Y approach"
- **End with reflection**: "Take note of what felt most challenging"
- **Focus on technique**: Describe the skill or concept being practiced without video references

### Quiz Question Design Strategy:
- **Bloom's Taxonomy Progression**: Start with recall, move to application/analysis
- **Misconception Targeting**: Include plausible wrong answers that address common errors
- **Context Variation**: Same concept tested in different scenarios
- **Visual Reference Integration**: Questions that tie back to specific video moments
- **Real-world Connection**: How does this concept apply beyond the tutorial?

### Question Distribution Per Challenge:
- **1 foundational knowledge question** (recall/understanding)
- **1-2 application questions** (using the skill in context)  
- **1 integration question** (connecting to other concepts)
- **Optional: 1 troubleshooting question** (handling variations/problems)

## Video Reference Guidelines
For each challenge, create precise references:
- **Identify specific timestamps** where relevant content appears
- **Explain connection** between video segment and challenge goal
- **Use natural language** to help learners navigate to the right content

## Quality Standards

### Each Challenge Must:
- Have a **unique, descriptive title**
- Define **clear learning objectives**
- Provide **actionable instruction**
- Include **meaningful assessments**
- Specify **concrete success criteria**
- Connect to **relevant video segments**

### Ensure Educational Value:
- **Progressive skill building** across challenges
- **Variety in learning activities** to maintain engagement
- **Practical application opportunities** for skill reinforcement
- **Clear connections** between theory and practice
- **Appropriate difficulty pacing** for the target audience

## Output Requirements

Return your analysis as a **JSON array** following the **EXACT** format specification below. Each challenge object must include all required fields with precise structure:

### Required JSON Structure:

\`\`\`json
[
  {
    "title": "Clear, descriptive name for the challenge (ensure uniqueness)",
    "objective": "What the student should achieve by the end of this challenge",
    "instruction": "**Clear, actionable instruction written in markdown format** that provides specific and actionable guidance for completing the challenge",
    "assignment": "Specific deliverable to demonstrate progress",
    "successCriteria": "Clear benchmarks to determine if the challenge is complete",
    "submissionFormat": "video|images|audio|text",
    "references": [
      {
        "location": {
          "startTime": "00:45",
          "endTime": "01:30"
        },
        "purpose": "Direct description of what this reference covers supporting the challenge"
      }
    ],
    "quizzes": [
      // SEE QUIZ FORMAT OPTIONS BELOW - USE EXACT STRUCTURES
    ]
  }
]
\`\`\`

### Quiz Format Options (Use EXACT Structures):

**Single-answer multiple choice:**
\`\`\`json
{
  "type": "singleChoice",
  "question": "What is the first step when mounting a skateboard?",
  "options": ["Step on with front foot", "Step on with back foot", "Jump on with both feet"],
  "correctAnswer": "Step on with back foot"
}
\`\`\`

**Multiple-answer multiple choice:**
\`\`\`json
{
  "type": "multipleChoice",
  "question": "Which are key elements of proper stance? (Select all that apply)",
  "options": ["Feet shoulder-width apart", "Knees slightly bent", "Arms crossed", "Weight centered"],
  "correctAnswers": ["Feet shoulder-width apart", "Knees slightly bent", "Weight centered"]
}
\`\`\`

**True/False:**
\`\`\`json
{
  "type": "trueFalse",
  "question": "You should always step on the skateboard with your front foot first",
  "correctAnswer": false
}
\`\`\`

**Sequence/Order:**
\`\`\`json
{
  "type": "sequence",
  "question": "Put these mounting steps in the correct order:",
  "options": ["Hold board steady", "Step on with back foot", "Place front foot", "Find balance"],
  "correctOrder": ["Hold board steady", "Step on with back foot", "Place front foot", "Find balance"]
}
\`\`\`

**Drag-and-Drop/Matching:**
\`\`\`json
{
  "type": "dragDrop",
  "question": "Match each skateboard part to its correct function",
  "pairs": [
    {"item": "Tail", "match": "Used for popping ollies"},
    {"item": "Trucks", "match": "Control turning and steering"},
    {"item": "Bearings", "match": "Allow wheels to spin smoothly"}
  ]
}
\`\`\`

**Slider/Scale:**
\`\`\`json
{
  "type": "slider",
  "question": "Set the optimal knee bend angle for skateboard stance",
  "minValue": 0,
  "maxValue": 90,
  "correctRange": {"min": 15, "max": 25},
  "unit": "degrees"
}
\`\`\`

### Critical Format Requirements:
- **Use 2-4 quizzes per challenge** with varied types for engagement
- **Follow exact JSON field names** and structures shown above
- **Note correctAnswer vs correctAnswers vs correctOrder vs correctRange** - use the right field for each quiz type
- **All timestamps must be in MM:SS format**
- **Instruction must be in markdown format with bold emphasis**
- **Instruction should focus on technique description without video references**

## Analysis Workflow

### Step 1: Video Overview
1. **Skim the entire video** to understand scope, pacing, and structure
2. **Identify 3-5 major learning objectives** the tutorial addresses
3. **Note instructor's expertise level** and teaching approach
4. **Assess tutorial quality** - clear demonstrations, good pacing, comprehensive coverage

### Step 2: Detailed Segmentation 
1. **Create timestamp markers** for each distinct concept or skill demonstration
2. **Identify natural break points** where practice would be beneficial
3. **Note visual elements** that would support learning (diagrams, close-ups, examples)
4. **Flag repetition and emphasis** - what does the instructor stress as important?

### Step 3: Challenge Architecture
1. **Map prerequisite relationships** between identified concepts  
2. **Sequence challenges** from foundational to advanced
3. **Identify gaps** where additional scaffolding might be needed
4. **Plan variety** in challenge types and quiz formats

### Step 4: Content Creation
1. **Write challenges in sequence** to maintain logical flow
2. **Cross-reference timestamps** to ensure accuracy
3. **Test quiz logic** - are correct answers clearly defendable?
4. **Verify progressive difficulty** across the challenge set

## Final Quality Checklist

Before submitting your JSON output, verify:

**Content Quality:**
- [ ] Each challenge targets 1-2 specific, measurable learning objectives
- [ ] Progressive difficulty from foundational concepts to practical application  
- [ ] Natural flow between challenges with clear prerequisite relationships
- [ ] Instruction is specific, actionable, and includes timing/success criteria
- [ ] Quiz questions test understanding and application, not just memorization

**Technical Accuracy:**
- [ ] All timestamps are accurate and in MM:SS format
- [ ] JSON structure matches the exact specification provided
- [ ] Quiz types use correct field names (correctAnswer vs correctAnswers etc.)
- [ ] References clearly connect video segments to challenge objectives
- [ ] Unique, descriptive challenge titles that avoid redundancy
- [ ] Instruction focuses on technique without video references

**Engagement Factors:**
- [ ] Varied quiz types across challenges to maintain interest
- [ ] Clear connection between video content and hands-on practice
- [ ] Appropriate challenge length for sustained focus (not overwhelming)
- [ ] Success criteria that provide clear completion guidance

Transform this tutorial into an engaging, gamified learning experience that helps users master the skills through active practice and progressive challenges.
`
}