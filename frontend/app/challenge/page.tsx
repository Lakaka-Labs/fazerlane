'use client'
import React, {useState, useEffect} from 'react';
import {CheckCircle, Circle, Play, X, Trophy, Flag, Clock, Target} from 'lucide-react';

const challenges = [
    {
        "id": "e5a1c7bd-0e1d-4925-9082-a7859bee9908",
        "lane": "8cf0cff2-8b88-4363-ac0e-3f150ae82e28",
        "title": "Mastering the Board Pickup",
        "objective": "Understand and practice the fundamental technique of picking up the skateboard with one foot.",
        "instruction": "**Stand beside your skateboard** with one foot on the ground and your other foot poised to step on the tail. **Apply pressure to the tail** of the board, allowing the nose to lift. **Slide your foot downwards** while applying pressure. **Catch the board with your hand** as it becomes vertical. Repeat this motion for 3-5 minutes, focusing on smooth control.",
        "assignment": "Record yourself performing the board pickup 5 times smoothly.",
        "submissionFormat": "video",
        "references": [
            {
                "challenge": "Mastering the Board Pickup",
                "location": {"startTime": "02:20", "endTime": "02:23"},
                "purpose": "Demonstration of the picking up the board motion with foot detail."
            },
            {
                "challenge": "Mastering the Board Pickup",
                "location": {"startTime": "01:09", "endTime": "01:12"},
                "purpose": "Introduction to picking up the board as a prerequisite skill."
            }
        ],
        "successCriteria": "Board is consistently elevated, caught cleanly without it flipping or spinning, and the foot slides down the tail naturally."
    },
    {
        "id": "bc352639-ca8d-44be-8f1b-4fb3e65e75cd",
        "lane": "8cf0cff2-8b88-4363-ac0e-3f150ae82e28",
        "title": "Foot Positioning for the Nollie 180 (Static)",
        "objective": "Correctly position both feet on the stationary skateboard for optimal Nollie 180 execution.",
        "instruction": "**Place your front foot** angled, covering the bolts, with the ball of your foot centered over the side of the nose (similar to a kickflip setup). **Position your back foot** on the tail, preferably slightly further back, allowing your heel to hang off the edge for better leverage. Practice this setup by rocking the board slightly side-to-side to feel the grip and balance. Ensure your weight is evenly distributed.",
        "assignment": "Take a photo of your front and back foot positions on a stationary skateboard.",
        "submissionFormat": "images",
        "references": [
            {
                "challenge": "Foot Positioning for the Nollie 180 (Static)",
                "location": {"startTime": "01:23", "endTime": "01:40"},
                "purpose": "Detailed explanation and visual of front foot positioning."
            },
            {
                "challenge": "Foot Positioning for the Nollie 180 (Static)",
                "location": {"startTime": "02:59", "endTime": "03:02"},
                "purpose": "Visual reminder of the ideal 'shove' spot on the tail."
            },
            {
                "challenge": "Foot Positioning for the Nollie 180 (Static)",
                "location": {"startTime": "01:50", "endTime": "02:16"},
                "purpose": "Detailed explanation and visual of back foot positioning options."
            }
        ],
        "successCriteria": "Front foot is angled and centered on the nose as described. Back foot is on the tail with heel slightly off, allowing for strong pop."
    },
    {
        "id": "04a6a17c-c9b0-4c5b-a966-914e0338ae54",
        "lane": "8cf0cff2-8b88-4363-ac0e-3f150ae82e28",
        "title": "Static Nollie Shove & Body Rotation",
        "objective": "Combine the board shove with a 180-degree body rotation while standing still, mimicking the full trick motion.",
        "instruction": "**Start with your feet in the correct Nollie 180 setup.** **Step off the board with your front foot**, pushing the nose down and backward with your back foot to initiate the 'shove'. As the board begins to rotate, **jump and turn your shoulders and hips 180 degrees** in the direction of the rotation. **Land with both feet back on the board** over the bolts. Repeat this 10-15 times, focusing on coordinating the shove and body rotation.\n*   **Troubleshooting:** If the board flips too much, ensure your back foot is 'guiding' the board on the grip tape, not just hitting the very edge of the tail. If you're struggling with the body rotation, try starting with your shoulders slightly open (pre-rotated 90 degrees).",
        "assignment": "Record a slow-motion video (if possible) of yourself performing the static Nollie 180 with rotation.",
        "submissionFormat": "video",
        "references": [
            {
                "challenge": "Static Nollie Shove & Body Rotation",
                "location": {"startTime": "02:45", "endTime": "02:58"},
                "purpose": "Demonstrates the initial 'shove' motion of the board."
            },
            {
                "challenge": "Static Nollie Shove & Body Rotation",
                "location": {"startTime": "03:13", "endTime": "03:22"},
                "purpose": "Introduction to combining the shove with body rotation for the 180-degree turn."
            },
            {
                "challenge": "Static Nollie Shove & Body Rotation",
                "location": {"startTime": "03:26", "endTime": "03:37"},
                "purpose": "Explanation of how opening shoulders aids in body rotation."
            },
            {
                "challenge": "Static Nollie Shove & Body Rotation",
                "location": {"startTime": "05:08", "endTime": "05:24"},
                "purpose": "Detailed breakdown of the back foot's role in the shove and body rotation."
            },
            {
                "challenge": "Static Nollie Shove & Body Rotation",
                "location": {"startTime": "05:39", "endTime": "05:50"},
                "purpose": "Tips on how back foot placement affects board flipping."
            }
        ],
        "successCriteria": "Board completes a 180-degree rotation. Body also rotates 180 degrees. You land with both feet on the board (even if not perfectly on the bolts yet)."
    },
    {
        "id": "2198c7b3-c1a1-4ae9-a858-f72e8b789276",
        "lane": "8cf0cff2-8b88-4363-ac0e-3f150ae82e28",
        "title": "The Advanced Stance Nollie 180 (Variation 1)",
        "objective": "Execute the Nollie 180 using the 'advanced stance' method, where you step off the board and rotate the body and board separately before landing.",
        "instruction": "**Begin with both feet on the bolts** of your stationary skateboard, with shoulders already turned 90 degrees in the direction of your intended rotation. **Step off the board with your front foot**, then quickly **shove the tail with your back foot** to initiate the board's 180-degree rotation. As the board spins beneath you, **jump and complete your body's 180-degree rotation.** **Land with both feet on the bolts** as the board finishes its rotation. Practice this sequence 15-20 times.\n*   **Focus on timing:** The body rotation should synchronize with the board's rotation.",
        "assignment": "Submit a video of yourself performing 5 successful 'Advanced Stance' Nollie 180s.",
        "submissionFormat": "video",
        "references": [
            {
                "challenge": "The Advanced Stance Nollie 180 (Variation 1)",
                "location": {"startTime": "03:55", "endTime": "03:58"},
                "purpose": "Explanation of jumping off and incorporating the learned 'shove'."
            },
            {
                "challenge": "The Advanced Stance Nollie 180 (Variation 1)",
                "location": {"startTime": "03:48", "endTime": "03:52"},
                "purpose": "Demonstration of the starting position with both feet on the board."
            },
            {
                "challenge": "The Advanced Stance Nollie 180 (Variation 1)",
                "location": {"startTime": "04:26", "endTime": "04:41"},
                "purpose": "Step-by-step visual demonstration of Variation 1 with overlays."
            }
        ],
        "successCriteria": "Both feet start on the board, front foot steps off, board and body rotate 180, and both feet land back on the bolts."
    },
    {
        "id": "c17e5cb4-d5df-4e75-b189-eebcb4a044e3",
        "lane": "8cf0cff2-8b88-4363-ac0e-3f150ae82e28",
        "title": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
        "objective": "Execute the Nollie 180 in a single, fluid motion using the 'scoop' technique, without stepping off the board.",
        "instruction": "**Start with your feet positioned as practiced in Challenge 2.** **Initiate the trick by simultaneously pushing down on the nose with your front foot and scooping the tail with your back foot**, while **rotating your shoulders and hips 180 degrees**. The key is to make it one fluid jump, pop, and turn. **Aim to land with both feet directly over the bolts.** Practice this dynamic trick 20-30 times.\n*   **Key is the scoop:** Your back foot should 'scoop' the tail rather than just pushing it straight down. This helps with the horizontal rotation. This technique is more challenging but results in a cleaner trick and helps with other tricks later.",
        "assignment": "Provide a video demonstrating 5 successful 'One-Motion' Nollie 180s.",
        "submissionFormat": "video",
        "references": [
            {
                "challenge": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
                "location": {"startTime": "05:10", "endTime": "05:18"},
                "purpose": "Emphasis on simultaneous pop, scoop, and body turn for fluidity."
            },
            {
                "challenge": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
                "location": {"startTime": "05:56", "endTime": "06:01"},
                "purpose": "Close-up of the back foot maintaining grip throughout the spin for a clean scoop."
            },
            {
                "challenge": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
                "location": {"startTime": "04:47", "endTime": "04:51"},
                "purpose": "Visual demonstration of Variation 2."
            },
            {
                "challenge": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
                "location": {"startTime": "00:59", "endTime": "01:04"},
                "purpose": "Introduction to Variation 2 as the preferred goal."
            },
            {
                "challenge": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
                "location": {"startTime": "04:53", "endTime": "04:57"},
                "purpose": "Explanation of the 'scoop' technique and its benefits for other tricks."
            }
        ],
        "successCriteria": "The trick is performed in one continuous motion (no stepping off). Board and body rotate 180 degrees. You land cleanly with both feet on the board."
    },
    {
        "id": "0103ecc7-2e04-4a5e-8fb9-c123c2b32199",
        "lane": "8cf0cff2-8b88-4363-ac0e-3f150ae82e28",
        "title": "Nollie 180 While Moving & Commitment",
        "objective": "Successfully perform the 'One-Motion' Nollie 180 while rolling slowly, and practice committing to the landing.",
        "instruction": "**Start rolling slowly** at a comfortable pace. **Execute the One-Motion Nollie 180 (Variation 2)**, focusing on maintaining your balance and completing the full body and board rotation. Once you feel comfortable landing the trick, **commit to landing with both feet on the bolts** every time.\n*   **Gradual Increase:** Practice first while barely moving, then slowly increase your speed. Remember to keep your shoulders open (pre-rotated) to aid the body spin. **If you're scared to commit, try just landing with one foot at a time initially, then slowly add the second foot.** Keep practicing daily for consistent improvement.",
        "assignment": "Upload a video showcasing 3 successful Nollie 180s while rolling at a slow to medium pace.",
        "submissionFormat": "video",
        "references": [
            {
                "challenge": "Nollie 180 While Moving & Commitment",
                "location": {"startTime": "07:07", "endTime": "07:11"},
                "purpose": "Full speed demonstration of a Nollie 180 while rolling."
            },
            {
                "challenge": "Nollie 180 While Moving & Commitment",
                "location": {"startTime": "04:10", "endTime": "04:12"},
                "purpose": "Suggestion to begin practicing the trick while slowly moving."
            },
            {
                "challenge": "Nollie 180 While Moving & Commitment",
                "location": {"startTime": "06:26", "endTime": "06:28"},
                "purpose": "Visual example of practicing with one foot while rolling."
            },
            {
                "challenge": "Nollie 180 While Moving & Commitment",
                "location": {"startTime": "06:20", "endTime": "06:24"},
                "purpose": "Advice for overcoming fear and returning to static practice if needed."
            },
            {
                "challenge": "Nollie 180 While Moving & Commitment",
                "location": {"startTime": "06:13", "endTime": "06:16"},
                "purpose": "Emphasis on committing to landing with both feet for full execution."
            }
        ],
        "successCriteria": "You successfully land the Nollie 180 while rolling, with both feet on the board and maintaining balance."
    }
];

const YOUTUBE_VIDEO_ID = '6-DqQQsQToE';

function parseTime(timeStr: any) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export default function F1SkateChallenger() {
    const [activeChallenge, setActiveChallenge] = useState(0);
    const [completedChallenges, setCompletedChallenges] = useState(new Set());
    const [showReferences, setShowReferences] = useState(false);
    const [activeReference, setActiveReference] = useState(null);

    const currentChallenge = challenges[activeChallenge];
    const progress = (completedChallenges.size / challenges.length) * 100;

    const handleCompleteChallenge = (id: any) => {
        setCompletedChallenges(new Set([...completedChallenges, id]));
        if (activeChallenge < challenges.length - 1) {
            setActiveChallenge(activeChallenge + 1);
        }
    };

    const formatInstruction = (text: any) => {
        return text.split('**').map((part: any, i: any) =>
            i % 2 === 1 ? <strong key={i} className="text-red-500">{part}</strong> : part
        );
    };

    const getYouTubeEmbedUrl = (ref: any) => {
        const startSeconds = parseTime(ref.location.startTime);
        const endSeconds = parseTime(ref.location.endTime);
        return `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${startSeconds}&end=${endSeconds}&autoplay=1`;
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
            {/* Racing Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-grid" style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Header */}
            <header className="relative z-10 bg-zinc-900 border-b-2 border-red-600 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Flag className="w-6 h-6 text-red-500"/>
                        <h1 className="text-2xl font-bold tracking-wider">NOLLIE 180 GRAND PRIX</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500"/>
                        <span className="text-sm">{completedChallenges.size}/{challenges.length} COMPLETED</span>
                    </div>
                </div>
            </header>

            {/* Race Track Progress */}
            <div className="relative z-10 bg-zinc-950 p-6 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto">
                    <div className="relative">
                        {/* Track */}
                        <div className="h-20 bg-zinc-800 rounded-full relative overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                                style={{width: `${progress}%`}}
                            />
                            {/* Track Markers */}
                            <div className="absolute inset-0 flex items-center justify-around px-8">
                                {challenges.map((challenge, i) => (
                                    <button
                                        key={challenge.id}
                                        onClick={() => setActiveChallenge(i)}
                                        className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300 relative
                      ${completedChallenges.has(challenge.id)
                                            ? 'bg-green-500 text-black'
                                            : activeChallenge === i
                                                ? 'bg-red-600 text-white animate-pulse'
                                                : 'bg-zinc-700 text-zinc-400'
                                        }
                    `}
                                    >
                                        {completedChallenges.has(challenge.id) ? (
                                            <CheckCircle className="w-5 h-5"/>
                                        ) : (
                                            <span className="text-xs font-bold">{i + 1}</span>
                                        )}
                                        {activeChallenge === i && (
                                            <div
                                                className="absolute -inset-2 border-2 border-red-500 rounded-full animate-pulse"/>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Challenge Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Challenge Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-wide">SECTOR {activeChallenge + 1}</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4"/>
                                <span>LAP TIME</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{currentChallenge.title}</h3>
                                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                                    <Target className="w-4 h-4"/>
                                    <span>OBJECTIVE</span>
                                </div>
                                <p className="text-zinc-300">{currentChallenge.objective}</p>
                            </div>

                            <div className="border-t border-zinc-800 pt-6">
                                <h4 className="text-sm font-bold text-red-500 mb-3">RACE BRIEFING</h4>
                                <div className="text-zinc-300 space-y-2">
                                    {formatInstruction(currentChallenge.instruction)}
                                </div>
                            </div>

                            <div className="bg-zinc-950 border border-zinc-800 rounded p-4">
                                <h4 className="text-sm font-bold text-yellow-500 mb-2">PIT STOP ASSIGNMENT</h4>
                                <p className="text-zinc-300">{currentChallenge.assignment}</p>
                                <div
                                    className="mt-2 inline-flex items-center gap-2 text-xs bg-zinc-800 px-3 py-1 rounded-full">
                                    <Circle className="w-3 h-3"/>
                                    <span className="uppercase">Format: {currentChallenge.submissionFormat}</span>
                                </div>
                            </div>

                            <div className="border-t border-zinc-800 pt-6">
                                <h4 className="text-sm font-bold text-green-500 mb-2">FINISH LINE CRITERIA</h4>
                                <p className="text-zinc-300">{currentChallenge.successCriteria}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowReferences(true)}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded flex items-center justify-center gap-2 transition-all"
                        >
                            <Play className="w-4 h-4"/>
                            <span>VIEW REPLAYS ({currentChallenge.references.length})</span>
                        </button>

                        <button
                            onClick={() => handleCompleteChallenge(currentChallenge.id)}
                            disabled={completedChallenges.has(currentChallenge.id)}
                            className={`
                flex-1 px-6 py-3 rounded flex items-center justify-center gap-2 transition-all
                ${completedChallenges.has(currentChallenge.id)
                                ? 'bg-green-500 text-black cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-500'
                            }
              `}
                        >
                            <CheckCircle className="w-4 h-4"/>
                            <span>{completedChallenges.has(currentChallenge.id) ? 'COMPLETED' : 'MARK COMPLETE'}</span>
                        </button>
                    </div>
                </div>

                {/* Side Panel - Challenge List */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-red-500 mb-4">RACE SECTORS</h3>
                    <div className="space-y-2">
                        {challenges.map((challenge, i) => (
                            <button
                                key={challenge.id}
                                onClick={() => setActiveChallenge(i)}
                                className={`
                  w-full text-left p-3 rounded transition-all
                  ${activeChallenge === i
                                    ? 'bg-red-600 text-white'
                                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                }
                `}
                            >
                                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {i + 1}. {challenge.title.substring(0, 25)}...
                  </span>
                                    {completedChallenges.has(challenge.id) && (
                                        <CheckCircle className="w-4 h-4 text-green-400"/>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* References Modal */}
            {showReferences && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div
                        className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="bg-zinc-800 p-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">RACE REPLAYS</h3>
                            <button
                                onClick={() => {
                                    setShowReferences(false);
                                    setActiveReference(null);
                                }}
                                className="p-2 hover:bg-zinc-700 rounded"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="p-4">
                            {activeReference ? (
                                <div className="space-y-4">
                                    <div className="aspect-video bg-black rounded overflow-hidden">
                                        <iframe
                                            src={getYouTubeEmbedUrl(activeReference)}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="bg-zinc-800 p-4 rounded">
                                        <p className="text-sm text-zinc-300">{activeReference.purpose}</p>
                                        <p className="text-xs text-zinc-500 mt-2">
                                            {activeReference.location.startTime} - {activeReference.location.endTime}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveReference(null)}
                                        className="w-full bg-zinc-800 hover:bg-zinc-700 py-2 rounded"
                                    >
                                        Back to Replay List
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {currentChallenge.references.map((ref, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveReference(ref)}
                                            className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded text-left transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium mb-1">{ref.purpose}</p>
                                                    <p className="text-xs text-zinc-400">
                                                        {ref.location.startTime} - {ref.location.endTime}
                                                    </p>
                                                </div>
                                                <Play className="w-5 h-5 text-red-500"/>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}