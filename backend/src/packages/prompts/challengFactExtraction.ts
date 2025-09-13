export const challengeFactExtractionPrompt = `Please extract educational content facts from challenge data. The input will always contain: challenge_title, objective, practice_instructions, assignment, and success_criteria. Always include the challenge title in the facts.

Here are some few shot examples:

Input: challenge_title: "Basic Skateboard Mounting", objective: "Learn proper foot placement and mounting technique", practice_instructions: ["Place back foot on tail", "Step up with front foot", "Find balance position"], assignment: "Demonstrate mounting 5 times successfully", success_criteria: "Successfully mount skateboard with proper form 5 consecutive times"
Output: {"facts" : ["Challenge: Basic Skateboard Mounting", "Skill taught: foot placement and mounting technique", "Key steps: back foot on tail, front foot step up, find balance position", "Assignment: demonstrate mounting 5 times successfully", "Success requirement: 5 consecutive successful mounts with proper form", "Activity type: physical skill demonstration", "Skill level: beginner skateboarding"]}

Input: challenge_title: "Advanced JavaScript Promises", objective: "Master asynchronous programming with Promise chains", practice_instructions: ["Create basic Promise structures", "Implement error handling with catch", "Chain multiple Promises together"], assignment: "Build a weather API integration using Promises", success_criteria: "API integration works correctly with proper error handling and Promise chaining"
Output: {"facts" : ["Challenge: Advanced JavaScript Promises", "Skill taught: asynchronous programming with Promise chains", "Key techniques: Promise structures, error handling with catch, Promise chaining", "Assignment: weather API integration using Promises", "Success requirement: working API integration with error handling and chaining", "Programming language: JavaScript", "Skill level: advanced programming"]}

Input: challenge_title: "Photosynthesis Fundamentals", objective: "Understand the basic process of photosynthesis in plants", practice_instructions: ["Identify chloroplasts in leaf diagrams", "Trace light energy conversion", "Map carbon dioxide and oxygen exchange"], assignment: "Create a labeled diagram showing photosynthesis process", success_criteria: "Diagram correctly shows all major components and energy flow with 90% accuracy"
Output: {"facts" : ["Challenge: Photosynthesis Fundamentals", "Concept taught: basic photosynthesis process in plants", "Key activities: chloroplast identification, light energy conversion tracing, gas exchange mapping", "Assignment: labeled photosynthesis process diagram", "Success requirement: diagram with 90% accuracy showing components and energy flow", "Subject area: biology", "Skill level: fundamental science"]}

Input: challenge_title: "Watercolor Wet-on-Wet Technique", objective: "Master basic wet-on-wet watercolor painting method", practice_instructions: ["Prepare wet paper surface", "Mix paint to proper consistency", "Apply paint while paper is damp", "Control color bleeding"], assignment: "Create a landscape painting using only wet-on-wet technique", success_criteria: "Painting demonstrates controlled wet-on-wet effects with smooth color transitions"
Output: {"facts" : ["Challenge: Watercolor Wet-on-Wet Technique", "Skill taught: wet-on-wet watercolor painting method", "Key techniques: wet paper preparation, paint consistency mixing, damp application, color bleeding control", "Assignment: landscape painting using wet-on-wet technique", "Success requirement: controlled wet-on-wet effects with smooth color transitions", "Art medium: watercolor", "Skill category: painting technique"]}

Input: challenge_title: "Guitar Chord Transitions", objective: "Develop smooth transitions between basic chords", practice_instructions: ["Practice G to C chord change slowly", "Focus on finger positioning", "Increase tempo gradually", "Use metronome for timing"], assignment: "Play chord progression G-C-Am-F at 60 BPM cleanly", success_criteria: "Clean chord transitions at 60 BPM with no buzzing or muted strings for 2 minutes straight"
Output: {"facts" : ["Challenge: Guitar Chord Transitions", "Skill taught: smooth transitions between basic chords", "Key practices: G to C chord changes, finger positioning, tempo building, metronome timing", "Assignment: G-C-Am-F progression at 60 BPM", "Success requirement: clean transitions at 60 BPM for 2 minutes with no buzzing or muting", "Instrument: guitar", "Skill type: musical technique"]}

Extract facts about:
- Challenge title (always include)
- Skills and concepts taught
- Key techniques, steps, or activities from practice instructions
- Assignment details and deliverables
- Success criteria and performance standards
- Subject area, medium, or domain
- Skill level indicators
- Activity or assessment type

Return the facts in JSON format as shown above.`;