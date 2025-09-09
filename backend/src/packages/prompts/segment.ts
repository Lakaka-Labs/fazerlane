export const getSegmentPrompt = () => {
    return `
**Task:** Analyze the provided YouTube link and segment it into logical learning sections that are specifically relevant to achieving the video's primary educational objective or skill.

**Input:**
- **YouTube Link**  

**Processing Requirements:**
- **Primary Focus:** Identify the main learning objective or skill being taught in the video from its content, title, and structure
- Segment the video to prioritize content that directly contributes to achieving this identified learning objective
- Filter out or deprioritize content that doesn't support the specific educational goal
- Look for prerequisite knowledge segments that are essential for mastering the main skill
- Identify natural topic transitions within goal-relevant content
- Consider speaker changes, visual demonstrations, or topic introductions as segment markers
- Focus on educational/instructional content boundaries related to the primary objective
- Aim for segments between 1-10 minutes for optimal focused learning chunks
- Include foundational segments only if they're necessary for achieving the main learning objective

**Content Filtering Logic:**
- **Include:** Segments directly teaching the primary skill/technique
- **Include:** Essential prerequisites and foundational knowledge for the main objective
- **Include:** Progressive skill-building demonstrations that lead to mastery
- **Include:** Troubleshooting and common mistakes specific to the primary skill
- **Include:** Practice exercises and drills for the target capability
- **Exclude:** Tangential topics not required for the main learning objective
- **Exclude:** Advanced techniques beyond the video's primary scope
- **Exclude:** General introductions or conclusions not relevant to the specific skill
- **Exclude:** Alternative methods if they don't serve the primary educational goal

**Output Format:**
Provide a JSON array where each segment contains:
\`\`\`json
[
  {
    "startTime": "MM:SS or HH:MM:SS format",
    "endTime": "MM:SS or HH:MM:SS format",
    "title": "Descriptive title for this learning segment",
    "summary": "2-3 sentence overview of key concepts covered in this segment",
    "learningObjectives": "Bullet-pointed list of specific skills demonstrated in this segment toward the main objective",
    "visualElements": "Array of important visual demonstrations or techniques shown",
    "transcription": "Complete verbatim transcription of spoken content in this time range"
  }
]
\`\`\`

**Quality Guidelines:**
- Every included segment must have clear relevance to the video's primary learning objective
- Summaries should emphasize how content connects to achieving the main skill
- Segment titles should indicate progression toward mastering the target capability
- Learning objectives should be measurable steps toward skill completion
- Segment boundaries should feel natural and represent logical checkpoints in skill-directed learning
- Transcriptions must be accurate and include important verbal explanations related to the main objective
- Each segment should represent a complete learning unit focused on skill progression

**Example Usage:**
*Video:* "Complete Cooking Masterclass" (2 hours)
*Identified Primary Objective:* "Learn how to make perfect scrambled eggs" (derived from video analysis)

**Example Output:**
\`\`\`json
[
  {
    "startTime": "05:30",
    "endTime": "08:45",
    "title": "Egg Selection and Preparation Basics",
    "summary": "Demonstrates how to choose fresh eggs and proper preparation techniques including room temperature timing and basic whisking methods. Covers the foundation steps that directly impact final scrambled egg quality.",
    "learningObjectives": [
      "Select the freshest eggs for optimal results",
      "Bring eggs to proper room temperature",
      "Master basic whisking technique for even mixture"
    ],
    "visualElements": ["egg freshness testing", "whisking demonstration", "preparation setup"],
    "transcription": "The key to perfect scrambled eggs starts with selecting the right eggs. You want to look for eggs that are..."
  },
  {
    "startTime": "22:15",
    "endTime": "28:30",
    "title": "Low-Heat Scrambling Technique",
    "summary": "Step-by-step demonstration of the low and slow scrambling method including proper pan temperature, stirring technique, and timing. Shows the exact motions and heat control needed for creamy, perfect scrambled eggs.",
    "learningObjectives": [
      "Control pan temperature for optimal cooking",
      "Execute proper stirring motion and timing",
      "Recognize visual cues for perfect doneness",
      "Achieve creamy, non-rubbery egg texture"
    ],
    "visualElements": ["pan temperature control", "stirring technique", "texture progression", "doneness indicators"],
    "transcription": "Now we're going to cook these eggs low and slow. Heat your pan on medium-low, and I mean really low heat here..."
  },
  {
    "startTime": "28:30",
    "endTime": "31:00",
    "title": "Finishing Touches and Common Mistakes",
    "summary": "Covers the final steps including when to remove from heat, finishing with butter or cream, and seasoning timing. Addresses the most common mistakes that lead to overcooked or poorly textured scrambled eggs.",
    "learningObjectives": [
      "Time the removal from heat perfectly",
      "Add finishing touches for enhanced texture",
      "Avoid overcooking and common texture problems",
      "Season at the optimal moment"
    ],
    "visualElements": ["heat removal timing", "butter incorporation", "final plating", "mistake examples"],
    "transcription": "This is the crucial moment - you want to remove the eggs from heat while they still look slightly underdone..."
  }
]
\`\`\`

**Note:** Content like "Advanced Soufflé Techniques," "Restaurant Kitchen Management," or "Culinary History" would be excluded from this objective-focused segmentation as they don't contribute to learning the video's primary educational goal of making perfect scrambled eggs.    `
}