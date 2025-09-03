**Task:** Analyze the provided YouTube link and segment it into logical learning sections that are specifically relevant to achieving a stated learning goal.

**Input:**
- **YouTube Link**  
- **Goal**: How to Ollie over an obstacles
- **Schedule**: 1-hour practice session a day
- **Experience**: I am comfortable on my board, I can push, carve, kick turn, stopping and running off my board

**Processing Requirements:**
- **Primary Focus:** Identify and prioritize video segments that directly contribute to achieving the stated learning goal
- Filter out or deprioritize content that doesn't support the specific learning objective
- Look for prerequisite knowledge segments that are essential for the goal
- Identify natural topic transitions within goal-relevant content
- Consider speaker changes, visual demonstrations, or topic introductions as segment markers
- Focus on educational/instructional content boundaries related to the goal
- Aim for segments between 1-10 minutes for optimal goal-focused learning chunks
- Include foundational segments only if they're necessary for achieving the goal

**Content Filtering Logic:**
- **Include:** Segments directly teaching the goal skill/technique
- **Include:** Essential prerequisites and foundational knowledge for the goal
- **Include:** Progressive skill-building demonstrations that lead to the goal
- **Include:** Troubleshooting and common mistakes specific to the goal
- **Include:** Practice exercises and drills for the target skill
- **Exclude:** Tangential topics not required for the goal
- **Exclude:** Advanced techniques beyond the stated goal scope
- **Exclude:** General introductions or conclusions not relevant to the specific goal
- **Exclude:** Alternative methods if they don't serve the primary goal

**Output Format:**
Provide a JSON array where each segment contains:
```json
[
  {
    "startTime": "MM:SS or HH:MM:SS format",
    "endTime": "MM:SS or HH:MM:SS format",
    "title": "Descriptive title for this learning segment",
    "summary": "2-3 sentence overview of key concepts covered in this segment",
    "learningObjectives": "Bullet-pointed list of specific skills demonstrated in this segment toward the goal",
    "visualElements": "Array of important visual demonstrations or techniques shown",
    "transcription": "Complete verbatim transcription of spoken content in this time range"
  }
]
```

**Quality Guidelines:**
- Every included segment must have clear relevance to the stated learning goal
- Summaries should emphasize how content connects to achieving the goal
- Segment titles should indicate progression toward the target skill
- Learning objectives should be measurable steps toward goal completion
- Segment boundaries should feel natural and represent logical checkpoints in goal-directed learning
- Transcriptions must be accurate and include important verbal explanations related to the goal
- Each segment should represent a complete learning unit focused on goal progression

**Example Usage:**
*Video:* "Complete Cooking Masterclass" (2 hours)
*Learning Goal:* "Learn how to make perfect scrambled eggs"

**Example Output:**
```json
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
```

**Note:** Content like "Advanced Soufflé Techniques," "Restaurant Kitchen Management," or "Culinary History" would be excluded from this goal-focused segmentation as they don't contribute to learning how to make perfect scrambled eggs.