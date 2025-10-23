export async function getLane(id: string | null) {
  if (!id) {
    return Promise.resolve(null);
  }

  return Promise.resolve(dummyLaneValues);
}

export interface Challenges {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  objective: string;
  instructions: string;
  references: {
    title: string;
    type: "video" | "article";
    url: string;
  }[];
  progress: number;
  attempts: {
    total: number;
    lastAttempt: string;
  };
}

export interface LaneValues {
  title: string;
  challenges: Challenges[];
}

export const dummyLaneValues = {
  title:
    "How to Do Every 180 on a Skateboard - Backside, Front-side and Half Cab",
  challenges: [
    {
      id: "1",
      title: "The Advanced Stance Nollie 180 (Variation 1)",
      difficulty: "Easy",
      objective:
        "Execute the Nollie 180 using the 'advanced stance' method, where you step off the board and rotate the body and board separately before landing.",
      instructions:
        "Begin with both feet on the bolts of your stationary skateboard, with shoulders already turned 90 degrees in the direction of your intended rotation. Step off the board with your front foot, then quickly shove the tail with your back foot to initiate the board's 180-degree rotation. As the board spins beneath you, jump and complete your body's 180-degree rotation. Land with both feet on the bolts as the board finishes its rotation. Practice this sequence 15–20 times. Focus on timing: the body rotation should synchronize with the board's rotation.",
      references: [
        {
          title:
            "Explanation of jumping off and incorporating the learned 'shove'.",
          type: "video",
          url: "/temp/image 2.png",
        },
        {
          title:
            "Demonstration of the starting position with both feet on the board.",
          type: "video",
          url: "/temp/image 2.png",
        },
        {
          title:
            "Step-by-step visual demonstration of Variation 1 with overlays.",
          type: "video",
          url: "/temp/image 2.png",
        },
      ],
      progress: 80,
      attempts: {
        total: 12,
        lastAttempt: "2 days ago",
      },
    },
    {
      id: "2",
      title: "Switch Nollie 360 Practice",
      difficulty: "Medium",
      objective:
        "Learn to rotate both board and body in a full 360 using switch stance for improved balance and coordination.",
      instructions:
        "Start in switch stance with your shoulders parallel to the board. Pop the nose and guide the board through a full rotation using your front foot. Maintain even weight distribution and spot your landing early. Repeat 10–15 times for muscle memory.",
      references: [
        {
          title: "Slow-motion breakdown of the switch pop technique.",
          type: "video",
          url: "/temp/image 2.png",
        },
        {
          title: "Common mistakes when spinning 360s.",
          type: "article",
          url: "#",
        },
      ],
      progress: 80,
      attempts: {
        total: 12,
        lastAttempt: "2 days ago",
      },
    },
    {
      id: "3",
      title: "Fakie Bigspin Drill",
      difficulty: "Hard",
      objective:
        "Combine a fakie shove-it with a 180 body spin to create a seamless bigspin motion.",
      instructions:
        "Roll fakie and crouch slightly. Scoop the tail aggressively while turning your shoulders. Let the board rotate beneath you while your body completes a matching 180 spin. Catch and land with both feet aligned with the bolts.",
      references: [
        {
          title: "Pro tutorial: mastering control on fakie spins.",
          type: "video",
          url: "/temp/image 2.png",
        },
        {
          title: "Analyzing foot placement in bigspins.",
          type: "article",
          url: "#",
        },
      ],
      progress: 80,
      attempts: {
        total: 12,
        lastAttempt: "2 days ago",
      },
    },
    {
      id: "4",
      title: "Frontside Shove-It Control Session",
      difficulty: "Easy",
      objective:
        "Improve balance and foot coordination to achieve smoother frontside shove-its while maintaining board contact.",
      instructions:
        "Stand with even weight over both feet. Push the tail diagonally behind you while keeping the front foot steady. Watch the board rotate and land softly back on the bolts. Repeat until consistent.",
      references: [
        {
          title: "Beginner-friendly frontside shove-it demonstration.",
          type: "video",
          url: "/temp/image 2.png",
        },
        {
          title: "Foot angle guide for consistent rotation.",
          type: "article",
          url: "#",
        },
      ],
      progress: 80,
      attempts: {
        total: 12,
        lastAttempt: "2 days ago",
      },
    },
    {
      id: "5",
      title: "Nollie 180 (Variation 2 – Spin Sync)",
      difficulty: "Medium",
      objective:
        "Enhance rotation timing by synchronizing board and body spin in a single fluid motion.",
      instructions:
        "Begin with shoulders and hips aligned forward. Pop the nose, then twist your shoulders and hips together as the board rotates. Keep your eyes forward to maintain orientation and land cleanly on both bolts.",
      references: [
        {
          title: "Real-time demonstration of synchronized rotation.",
          type: "video",
          url: "/temp/image 2.png",
        },
        {
          title: "Comparison between Variation 1 and 2 timing mechanics.",
          type: "article",
          url: "#",
        },
      ],
      progress: 80,
      attempts: {
        total: 12,
        lastAttempt: "2 days ago",
      },
    },
  ],
} satisfies LaneValues;
