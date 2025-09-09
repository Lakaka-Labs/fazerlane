challenge Reference Generation Request

Task: Generate an array of resource references for a single challenge by mapping challenge components to the provided segmented resources, using raw data files as reference context.

Input:

A single challenge object containing:
- challenge_title: The challenge name
- objective: Learning goal for the challenge
- practice_instructions: Array of instruction steps
- assignment: Specific deliverable
- quizzes: Knowledge check questions
- success_criteria: Completion benchmarks

Segmented learning resources in the following formats:
**YouTube Resources:**
```json
[
  {
    "resource_title": "Youtube Title",
    "segments": [
      {
        "segment_id": "youtube_001",
        "startTime": "00:00",
        "endTime": "03:45", 
        "summary": "...",
        "transcription": "..."
      }
    ]
  }
]
```

Raw data files for reference context:
- Original youtube link
- Analyze these link directly to validate segmented resource accuracy
- Use link content to identify precise reference locations and enhance mapping accuracy

Requirements:

- Analyze raw data files to understand complete resource content
- Map challenge components (practice instructions, assignment, quizzes) to relevant resource segments
- Create structured reference_location objects that match the resource type structure
- Provide natural language descriptions for both location and purpose
- Determine how each reference supports the challenge content
- Ensure all critical challenge components are supported by appropriate resource references

Output Format:
Provide a JSON array where each reference contains these four fields:
```json
[
  {
    "segment_id": "resource_segment_identifier",
    "reference_location": {
      "startTime": "00:45",
      "endTime": "01:30"
    },
    "reference_location_description": "Natural language description of where to find this content",
    "reference_purpose": "Natural language explanation of how this reference supports the challenge"
  }
]
```

Guidelines:

- **File Analysis**: Directly analyze provided raw data files to ensure accuracy
- **Structured References**: Use appropriate reference_location object structure based on resource type
- **Natural Language Clarity**: Write reference_location_description and reference_purpose in clear, conversational language
- **Precise Targeting**: For videos, specify exact time ranges; for documents, specific page ranges; for images, relevant visual elements
- **Comprehensive Coverage**: Include references for all major challenge components
- **Descriptive Purpose**: Explain specifically how each reference helps the learner achieve the challenge objective
- **Logical Flow**: Order references to support challenge progression
- **Human-Friendly Descriptions**: Make location descriptions easy to understand for learners navigating the resources

Example Output:
```json
[
  {
    "segment_id": "skateboard_stance_yt_001",
    "reference_location": {
      "startTime": "00:30",
      "endTime": "01:45"
    },
    "reference_location_description": "From 30 seconds to 1 minute 45 seconds in the video",
    "reference_purpose": "Shows a detailed demonstration of proper foot placement on the skateboard, including the correct angle and positioning that students need to replicate"
  },
  {
    "segment_id": "youtube_tutorial_004",
    "reference_location": {
      "startTime": "03:20",
      "endTime": "04:10"
    },
    "reference_location_description": "Between 3 minutes 20 seconds and 4 minutes 10 seconds of the tutorial",
    "reference_purpose": "Highlights common balance mistakes beginners make, helping students identify and avoid these errors in their own practice"
  }
]
```
Note: Analyze the raw data files thoroughly to ensure each reference accurately maps to content that supports the challenge objectives. Write natural language descriptions that are clear, helpful, and easy for learners to follow when accessing the resources.