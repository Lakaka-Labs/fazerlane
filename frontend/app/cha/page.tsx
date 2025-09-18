'use client'
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Circle, Video, Camera, FileText, ChevronRight, Trophy, Target, Clock, Flag, Zap, Activity, AlertCircle } from 'lucide-react';

const challenges = [
    {
        "id": "e5a1c7bd-0e1d-4925-9082-a7859bee9908",
        "title": "Mastering the Board Pickup",
        "objective": "Understand and practice the fundamental technique of picking up the skateboard with one foot.",
        "instruction": "**Stand beside your skateboard** with one foot on the ground and your other foot poised to step on the tail. **Apply pressure to the tail** of the board, allowing the nose to lift. **Slide your foot downwards** while applying pressure. **Catch the board with your hand** as it becomes vertical. Repeat this motion for 3-5 minutes, focusing on smooth control.",
        "assignment": "Record yourself performing the board pickup 5 times smoothly.",
        "submissionFormat": "video",
        "references": [
            { "location": { "startTime": "02:20", "endTime": "02:23" }, "purpose": "Demonstration of the picking up the board motion with foot detail." },
            { "location": { "startTime": "01:09", "endTime": "01:12" }, "purpose": "Introduction to picking up the board as a prerequisite skill." }
        ],
        "successCriteria": "Board is consistently elevated, caught cleanly without it flipping or spinning, and the foot slides down the tail naturally."
    },
    {
        "id": "bc352639-ca8d-44be-8f1b-4fb3e65e75cd",
        "title": "Foot Positioning for the Nollie 180 (Static)",
        "objective": "Correctly position both feet on the stationary skateboard for optimal Nollie 180 execution.",
        "instruction": "**Place your front foot** angled, covering the bolts, with the ball of your foot centered over the side of the nose (similar to a kickflip setup). **Position your back foot** on the tail, preferably slightly further back, allowing your heel to hang off the edge for better leverage. Practice this setup by rocking the board slightly side-to-side to feel the grip and balance. Ensure your weight is evenly distributed.",
        "assignment": "Take a photo of your front and back foot positions on a stationary skateboard.",
        "submissionFormat": "images",
        "references": [
            { "location": { "startTime": "01:23", "endTime": "01:40" }, "purpose": "Detailed explanation and visual of front foot positioning." },
            { "location": { "startTime": "02:59", "endTime": "03:02" }, "purpose": "Visual reminder of the ideal 'shove' spot on the tail." },
            { "location": { "startTime": "01:50", "endTime": "02:16" }, "purpose": "Detailed explanation and visual of back foot positioning options." }
        ],
        "successCriteria": "Front foot is angled and centered on the nose as described. Back foot is on the tail with heel slightly off, allowing for strong pop."
    },
    {
        "id": "04a6a17c-c9b0-4c5b-a966-914e0338ae54",
        "title": "Static Nollie Shove & Body Rotation",
        "objective": "Combine the board shove with a 180-degree body rotation while standing still, mimicking the full trick motion.",
        "instruction": "**Start with your feet in the correct Nollie 180 setup.** **Step off the board with your front foot**, pushing the nose down and backward with your back foot to initiate the 'shove'. As the board begins to rotate, **jump and turn your shoulders and hips 180 degrees** in the direction of the rotation. **Land with both feet back on the board** over the bolts. Repeat this 10-15 times, focusing on coordinating the shove and body rotation.\n*   **Troubleshooting:** If the board flips too much, ensure your back foot is 'guiding' the board on the grip tape, not just hitting the very edge of the tail. If you're struggling with the body rotation, try starting with your shoulders slightly open (pre-rotated 90 degrees).",
        "assignment": "Record a slow-motion video (if possible) of yourself performing the static Nollie 180 with rotation.",
        "submissionFormat": "video",
        "references": [
            { "location": { "startTime": "02:45", "endTime": "02:58" }, "purpose": "Demonstrates the initial 'shove' motion of the board." },
            { "location": { "startTime": "03:13", "endTime": "03:22" }, "purpose": "Introduction to combining the shove with body rotation for the 180-degree turn." },
            { "location": { "startTime": "03:26", "endTime": "03:37" }, "purpose": "Explanation of how opening shoulders aids in body rotation." },
            { "location": { "startTime": "05:08", "endTime": "05:24" }, "purpose": "Detailed breakdown of the back foot's role in the shove and body rotation." },
            { "location": { "startTime": "05:39", "endTime": "05:50" }, "purpose": "Tips on how back foot placement affects board flipping." }
        ],
        "successCriteria": "Board completes a 180-degree rotation. Body also rotates 180 degrees. You land with both feet on the board (even if not perfectly on the bolts yet)."
    },
    {
        "id": "2198c7b3-c1a1-4ae9-a858-f72e8b789276",
        "title": "The Advanced Stance Nollie 180 (Variation 1)",
        "objective": "Execute the Nollie 180 using the 'advanced stance' method, where you step off the board and rotate the body and board separately before landing.",
        "instruction": "**Begin with both feet on the bolts** of your stationary skateboard, with shoulders already turned 90 degrees in the direction of your intended rotation. **Step off the board with your front foot**, then quickly **shove the tail with your back foot** to initiate the board's 180-degree rotation. As the board spins beneath you, **jump and complete your body's 180-degree rotation.** **Land with both feet on the bolts** as the board finishes its rotation. Practice this sequence 15-20 times.\n*   **Focus on timing:** The body rotation should synchronize with the board's rotation.",
        "assignment": "Submit a video of yourself performing 5 successful 'Advanced Stance' Nollie 180s.",
        "submissionFormat": "video",
        "references": [
            { "location": { "startTime": "03:55", "endTime": "03:58" }, "purpose": "Explanation of jumping off and incorporating the learned 'shove'." },
            { "location": { "startTime": "03:48", "endTime": "03:52" }, "purpose": "Demonstration of the starting position with both feet on the board." },
            { "location": { "startTime": "04:26", "endTime": "04:41" }, "purpose": "Step-by-step visual demonstration of Variation 1 with overlays." }
        ],
        "successCriteria": "Both feet start on the board, front foot steps off, board and body rotate 180, and both feet land back on the bolts."
    },
    {
        "id": "c17e5cb4-d5df-4e75-b189-eebcb4a044e3",
        "title": "The One-Motion Nollie 180 (Variation 2 - Scoop Technique)",
        "objective": "Execute the Nollie 180 in a single, fluid motion using the 'scoop' technique, without stepping off the board.",
        "instruction": "**Start with your feet positioned as practiced in Challenge 2.** **Initiate the trick by simultaneously pushing down on the nose with your front foot and scooping the tail with your back foot**, while **rotating your shoulders and hips 180 degrees**. The key is to make it one fluid jump, pop, and turn. **Aim to land with both feet directly over the bolts.** Practice this dynamic trick 20-30 times.\n*   **Key is the scoop:** Your back foot should 'scoop' the tail rather than just pushing it straight down. This helps with the horizontal rotation. This technique is more challenging but results in a cleaner trick and helps with other tricks later.",
        "assignment": "Provide a video demonstrating 5 successful 'One-Motion' Nollie 180s.",
        "submissionFormat": "video",
        "references": [
            { "location": { "startTime": "05:10", "endTime": "05:18" }, "purpose": "Emphasis on simultaneous pop, scoop, and body turn for fluidity." },
            { "location": { "startTime": "05:56", "endTime": "06:01" }, "purpose": "Close-up of the back foot maintaining grip throughout the spin for a clean scoop." },
            { "location": { "startTime": "04:47", "endTime": "04:51" }, "purpose": "Visual demonstration of Variation 2." },
            { "location": { "startTime": "00:59", "endTime": "01:04" }, "purpose": "Introduction to Variation 2 as the preferred goal." },
            { "location": { "startTime": "04:53", "endTime": "04:57" }, "purpose": "Explanation of the 'scoop' technique and its benefits for other tricks." }
        ],
        "successCriteria": "The trick is performed in one continuous motion (no stepping off). Board and body rotate 180 degrees. You land cleanly with both feet on the board."
    },
    {
        "id": "0103ecc7-2e04-4a5e-8fb9-c123c2b32199",
        "title": "Nollie 180 While Moving & Commitment",
        "objective": "Successfully perform the 'One-Motion' Nollie 180 while rolling slowly, and practice committing to the landing.",
        "instruction": "**Start rolling slowly** at a comfortable pace. **Execute the One-Motion Nollie 180 (Variation 2)**, focusing on maintaining your balance and completing the full body and board rotation. Once you feel comfortable landing the trick, **commit to landing with both feet on the bolts** every time.\n*   **Gradual Increase:** Practice first while barely moving, then slowly increase your speed. Remember to keep your shoulders open (pre-rotated) to aid the body spin. **If you're scared to commit, try just landing with one foot at a time initially, then slowly add the second foot.** Keep practicing daily for consistent improvement.",
        "assignment": "Upload a video showcasing 3 successful Nollie 180s while rolling at a slow to medium pace.",
        "submissionFormat": "video",
        "references": [
            { "location": { "startTime": "07:07", "endTime": "07:11" }, "purpose": "Full speed demonstration of a Nollie 180 while rolling." },
            { "location": { "startTime": "04:10", "endTime": "04:12" }, "purpose": "Suggestion to begin practicing the trick while slowly moving." },
            { "location": { "startTime": "06:26", "endTime": "06:28" }, "purpose": "Visual example of practicing with one foot while rolling." },
            { "location": { "startTime": "06:20", "endTime": "06:24" }, "purpose": "Advice for overcoming fear and returning to static practice if needed." },
            { "location": { "startTime": "06:13", "endTime": "06:16" }, "purpose": "Emphasis on committing to landing with both feet for full execution." }
        ],
        "successCriteria": "You successfully land the Nollie 180 while rolling, with both feet on the board and maintaining balance."
    }
];

const YOUTUBE_ID = "6-DqQQsQToE";

function App() {
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [showReferences, setShowReferences] = useState(false);
    const [selectedReference, setSelectedReference] = useState(null);

    const toggleComplete = (id) => {
        setCompletedChallenges(prev =>
            prev.includes(id)
                ? prev.filter(cId => cId !== id)
                : [...prev, id]
        );
    };

    const parseInstruction = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-500">$1</strong>')
            .replace(/\n/g, '<br />');
    };

    const convertTimeToSeconds = (timeStr) => {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    const getSubmissionIcon = (format) => {
        switch(format) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'images': return <Camera className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const progress = (completedChallenges.length / challenges.length) * 100;

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.03) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}/>
            </div>

            {/* Racing Stripes */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"/>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"/>

            <div className="relative max-w-7xl mx-auto p-4">
                {/* Header - Racing Dashboard Style */}
                <div className="mb-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/>
                            <span className="text-red-500 text-xs font-mono uppercase tracking-wider">Live Session</span>
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                            NOLLIE 180 <span className="text-red-500">GRAND PRIX</span>
                        </h1>
                        <p className="text-zinc-400 font-mono text-sm uppercase tracking-wider">
                            Complete all sectors to achieve pole position
                        </p>
                    </div>

                    {/* Progress Bar - Lap Counter Style */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Flag className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-mono text-zinc-400 uppercase">Race Progress</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-white font-mono">{completedChallenges.length}</span>
                                    <span className="text-zinc-500 font-mono">/</span>
                                    <span className="text-lg text-zinc-400 font-mono">{challenges.length}</span>
                                </div>
                            </div>

                            <div className="relative h-6 bg-black rounded-full overflow-hidden border border-zinc-800">
                                <div className="absolute inset-0 flex">
                                    {challenges.map((_, idx) => (
                                        <div key={idx} className="flex-1 border-r border-zinc-800 last:border-r-0"/>
                                    ))}
                                </div>
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-700 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"/>
                                </div>
                                {/* Checkered Flag Pattern at 100% */}
                                {progress === 100 && (
                                    <div className="absolute inset-y-0 right-0 w-8 bg-repeat" style={{
                                        backgroundImage: `repeating-linear-gradient(90deg, white 0px, white 4px, black 4px, black 8px)`,
                                        backgroundSize: '8px 100%'
                                    }}/>
                                )}
                            </div>

                            {progress === 100 && (
                                <div className="mt-4 flex items-center justify-center gap-3 text-yellow-400">
                                    <Trophy className="w-6 h-6" />
                                    <span className="font-bold text-lg uppercase tracking-wider">Victory Lap Complete!</span>
                                    <Trophy className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sector Label */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/30"/>
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-500" />
                            <span className="text-red-500 font-mono text-sm uppercase tracking-wider">Track Sectors</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/30"/>
                    </div>
                </div>

                {/* Challenges Grid - Racing Sectors */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {challenges.map((challenge, index) => (
                        <div
                            key={challenge.id}
                            className={`group relative bg-gradient-to-br from-zinc-900 to-black border transition-all duration-300 overflow-hidden cursor-pointer ${
                                completedChallenges.includes(challenge.id)
                                    ? 'border-green-500 shadow-lg shadow-green-500/20'
                                    : 'border-zinc-800 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20'
                            }`}
                            onClick={() => setSelectedChallenge(challenge)}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
                        >
                            {/* Sector Number - Racing Style */}
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 p-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-mono font-bold text-sm">
                                            SECTOR {index + 1}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {completedChallenges.includes(challenge.id) && (
                                            <Zap className="w-4 h-4 text-yellow-400" />
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleComplete(challenge.id);
                                            }}
                                            className="transition-transform hover:scale-110"
                                        >
                                            {completedChallenges.includes(challenge.id) ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-white/50" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-14">
                                <h3 className="font-bold text-lg text-white mb-3 uppercase tracking-wide">
                                    {challenge.title}
                                </h3>

                                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 font-mono">
                                    {challenge.objective}
                                </p>

                                {/* Telemetry Style Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-500 font-mono uppercase">Submission</span>
                                        <div className="flex items-center gap-1 text-red-400">
                                            {getSubmissionIcon(challenge.submissionFormat)}
                                            <span className="capitalize">{challenge.submissionFormat}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-500 font-mono uppercase">Pit Stops</span>
                                        <div className="flex items-center gap-1 text-red-400">
                                            <Play className="w-3 h-3" />
                                            <span>{challenge.references.length} clips</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-mono text-zinc-600 uppercase">
                                        {completedChallenges.includes(challenge.id) ? 'Completed' : 'Pending'}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* Status Indicator Light */}
                            <div className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${
                                completedChallenges.includes(challenge.id)
                                    ? 'bg-green-500 animate-pulse'
                                    : 'bg-zinc-600'
                            }`}/>
                        </div>
                    ))}
                </div>

                {/* Challenge Detail Modal - Pit Stop Style */}
                {selectedChallenge && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                             style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}>

                            {/* Header - Racing HUD Style */}
                            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-xs font-mono text-white/70 mb-1 uppercase">
                                            Sector {challenges.indexOf(selectedChallenge) + 1} Briefing
                                        </div>
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-wide">{selectedChallenge.title}</h2>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-2">
                                                {getSubmissionIcon(selectedChallenge.submissionFormat)}
                                                <span className="text-sm text-white/70 capitalize font-mono">{selectedChallenge.submissionFormat}</span>
                                            </div>
                                            <button
                                                onClick={() => toggleComplete(selectedChallenge.id)}
                                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-yellow-400"
                                            >
                                                {completedChallenges.includes(selectedChallenge.id) ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                        <span className="text-green-400">Sector Clear</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Circle className="w-4 h-4" />
                                                        <span className="text-white">Mark Complete</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedChallenge(null);
                                            setShowReferences(false);
                                            setSelectedReference(null);
                                        }}
                                        className="text-white/50 hover:text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Race Objective */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Target className="w-5 h-5 text-red-500" />
                                        <h3 className="font-bold text-lg text-red-500 uppercase tracking-wider">Race Objective</h3>
                                    </div>
                                    <p className="text-zinc-300 leading-relaxed font-mono text-sm">{selectedChallenge.objective}</p>
                                </div>

                                {/* Racing Line Instructions */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        <h3 className="font-bold text-lg text-yellow-500 uppercase tracking-wider">Racing Line</h3>
                                    </div>
                                    <div
                                        className="text-zinc-300 leading-relaxed space-y-2 font-mono text-sm"
                                        dangerouslySetInnerHTML={{ __html: parseInstruction(selectedChallenge.instruction) }}
                                    />
                                </div>

                                {/* Pit Assignment */}
                                <div className="bg-red-900/20 border border-red-900/50 p-4">
                                    <h3 className="font-bold text-red-400 mb-2 uppercase tracking-wider">Pit Assignment</h3>
                                    <p className="text-zinc-300 font-mono text-sm">{selectedChallenge.assignment}</p>
                                </div>

                                {/* Victory Conditions */}
                                <div className="bg-green-900/20 border border-green-900/50 p-4">
                                    <h3 className="font-bold text-green-400 mb-2 uppercase tracking-wider">Victory Conditions</h3>
                                    <p className="text-green-300 font-mono text-sm">{selectedChallenge.successCriteria}</p>
                                </div>

                                {/* Telemetry Data (References) */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-bold text-lg text-blue-500 uppercase tracking-wider">Telemetry Data</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedChallenge.references.map((ref, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedReference(ref);
                                                    setShowReferences(true);
                                                }}
                                                className="w-full text-left p-3 bg-zinc-900/50 border border-zinc-800 hover:border-red-500 transition-all group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Play className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Clock className="w-3 h-3 text-zinc-500" />
                                                            <span className="text-xs font-mono text-zinc-400">
                                {ref.location.startTime} - {ref.location.endTime}
                              </span>
                                                        </div>
                                                        <p className="text-sm text-zinc-300 font-mono">{ref.purpose}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Video Display - Onboard Camera */}
                                {showReferences && selectedReference && (
                                    <div className="mt-6">
                                        <div className="bg-red-600 p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"/>
                                                <span className="text-xs font-mono text-white uppercase">Onboard Camera</span>
                                            </div>
                                        </div>
                                        <div className="aspect-video bg-black border-4 border-zinc-900">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?start=${convertTimeToSeconds(selectedReference.location.startTime)}&end=${convertTimeToSeconds(selectedReference.location.endTime)}&autoplay=1`}
                                                title="Onboard Camera Feed"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;