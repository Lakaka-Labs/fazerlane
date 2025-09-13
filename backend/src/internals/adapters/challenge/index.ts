import {SQL} from "bun";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import type {Challenge} from "../../domain/challenge";
import {DuplicateError} from "../../../packages/errors";

export default class ChallengePG implements ChallengeRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }


    add = async (milestoneId: string, challenges: Omit<Challenge, "id" | "milestone">[]): Promise<void> => {
        await this.sql.begin(async tx => {
            const winners =
                await tx`UPDATE milestones
                   SET challenge_generated = true
                 WHERE id        = ${milestoneId}
                   AND challenge_generated = false
                 RETURNING 1`;

            if (winners.count === 0) {
                throw new DuplicateError("already generated")
            }

            const challengeParameters = challenges.map((c) => ({
                milestone: milestoneId,
                challenge_title: c.challengeTitle,
                objective: c.objective,
                prerequisite_challenges: `{${c.prerequisiteChallenges.map((item) => `${item}`).join(',')}}`,
                builds_on_context: c.buildsOnContext,
                practice_instructions: `{${c.practiceInstructions.map((item) => `${item}`).join(',')}}`,
                assignment: c.assignment,
                submission_format: c.submissionFormat,
                success_criteria: c.successCriteria,
                memory_adaptations: c.memoryAdaptations,
            }));

            const insertedChallenges = await tx`
            INSERT INTO challenges ${tx(challengeParameters)}
            RETURNING id, challenge_title
        `;

            const challengeIdMap = new Map<string, string>();
            insertedChallenges.forEach((row: any) => {
                challengeIdMap.set(row.challenge_title, row.id);
            });

            // Prepare and insert references
            const allReferences: any = [];
            challenges.forEach((challenge) => {
                const challengeId = challengeIdMap.get(challenge.challengeTitle);
                if (challengeId && challenge.references) {
                    challenge.references.forEach((ref) => {
                        allReferences.push({
                            challenge: challengeId,
                            segment: ref.segment,
                            start_time: ref.referenceLocation.startTime,
                            end_time: ref.referenceLocation.endTime,
                            location_description: ref.referenceLocationDescription,
                            purpose: ref.referencePurpose,
                        });
                    });
                }
            });

            if (allReferences.length > 0) {
                await tx`INSERT INTO challenge_references ${tx(allReferences)}`;
            }

            // Prepare and insert quizzes
            const allQuizzes: any[] = [];
            challenges.forEach((challenge) => {
                const challengeId = challengeIdMap.get(challenge.challengeTitle);
                if (challengeId && challenge.quizzes) {
                    challenge.quizzes.forEach((quiz) => {
                        const baseQuiz = {
                            challenge: challengeId,
                            quiz_type: quiz.type,
                            question: quiz.question,
                            options: null,
                            correct_answer: null,
                            correct_answers: null,
                            correct_order: null,
                            pairs: null,
                            min_value: null,
                            max_value: null,
                            correct_range: null,
                            unit: null,
                        };

                        switch (quiz.type) {
                            case 'single_choice':
                                allQuizzes.push({
                                    ...baseQuiz,
                                    options: `{${quiz.options.map((item) => `${item}`).join(',')}}`,
                                    correct_answer: quiz.correctAnswer,
                                });
                                break;
                            case 'multiple_choice':
                                allQuizzes.push({
                                    ...baseQuiz,
                                    options: `{${quiz.options.map((item) => `${item}`).join(',')}}`,
                                    correct_answers: `{${quiz.correctAnswers.map((item) => `${item}`).join(',')}}`,
                                });
                                break;
                            case 'true_false':
                                allQuizzes.push({
                                    ...baseQuiz,
                                    correct_answer: quiz.correctAnswer.toString(),
                                });
                                break;
                            case 'sequence':
                                allQuizzes.push({
                                    ...baseQuiz,
                                    options: `{${quiz.options.map((item) => `${item}`).join(',')}}`,
                                    correct_order: `{${quiz.correctOrder.map((item) => `${item}`).join(',')}}`,
                                });
                                break;
                            case 'drag_drop':
                                allQuizzes.push({
                                    ...baseQuiz,
                                    pairs: JSON.stringify(quiz.pairs),
                                });
                                break;
                            case 'slider':
                                allQuizzes.push({
                                    ...baseQuiz,
                                    min_value: quiz.minValue,
                                    max_value: quiz.maxValue,
                                    correct_range: JSON.stringify(quiz.correctRange),
                                    unit: quiz.unit,
                                });
                                break;
                        }
                    });
                }
            });

            if (allQuizzes.length > 0) {
                await tx`INSERT INTO challenge_quizzes ${tx(allQuizzes)}`;
            }
        });
    };

    get = async (milestoneId: string): Promise<Challenge[]> => {
        // Get challenges with their references and quizzes
        const result = await this.sql`
            SELECT c.id,
                   c.milestone,
                   c.challenge_title,
                   c.objective,
                   c.prerequisite_challenges,
                   c.builds_on_context,
                   c.practice_instructions,
                   c.assignment,
                   c.submission_format,
                   c.success_criteria,
                   c.memory_adaptations,

                   -- References as JSON aggregation
                   COALESCE(
                                   JSON_AGG(
                                   CASE
                                       WHEN cr.id IS NOT NULL THEN
                                           JSON_BUILD_OBJECT(
                                                   'challenge', c.challenge_title,
                                                   'segment', cr.segment,
                                                   'referenceLocation', JSON_BUILD_OBJECT(
                                                           'startTime', cr.start_time,
                                                           'endTime', cr.end_time
                                                                        ),
                                                   'referenceLocationDescription', cr.location_description,
                                                   'referencePurpose', cr.purpose
                                           )
                                       END
                                           ) FILTER (WHERE cr.id IS NOT NULL),
                                   '[]'::json
                   ) as "references",

                   -- Quizzes as JSON aggregation
                   COALESCE(
                                   JSON_AGG(
                                   CASE
                                       WHEN cq.id IS NOT NULL THEN
                                           CASE cq.quiz_type
                                               WHEN 'single_choice' THEN
                                                   JSON_BUILD_OBJECT(
                                                           'challenge', c.challenge_title,
                                                           'type', cq.quiz_type,
                                                           'question', cq.question,
                                                           'options', cq.options,
                                                           'correctAnswer', cq.correct_answer
                                                   )
                                               WHEN 'multiple_choice' THEN
                                                   JSON_BUILD_OBJECT(
                                                           'challenge', c.challenge_title,
                                                           'type', cq.quiz_type,
                                                           'question', cq.question,
                                                           'options', cq.options,
                                                           'correctAnswers', cq.correct_answers
                                                   )
                                               WHEN 'true_false' THEN
                                                   JSON_BUILD_OBJECT(
                                                           'challenge', c.challenge_title,
                                                           'type', cq.quiz_type,
                                                           'question', cq.question,
                                                           'correctAnswer', (cq.correct_answer = 'true')
                                                   )
                                               WHEN 'sequence' THEN
                                                   JSON_BUILD_OBJECT(
                                                           'challenge', c.challenge_title,
                                                           'type', cq.quiz_type,
                                                           'question', cq.question,
                                                           'options', cq.options,
                                                           'correctOrder', cq.correct_order
                                                   )
                                               WHEN 'drag_drop' THEN
                                                   JSON_BUILD_OBJECT(
                                                           'challenge', c.challenge_title,
                                                           'type', cq.quiz_type,
                                                           'question', cq.question,
                                                           'pairs', cq.pairs::json
                                                   )
                                               WHEN 'slider' THEN
                                                   JSON_BUILD_OBJECT(
                                                           'challenge', c.challenge_title,
                                                           'type', cq.quiz_type,
                                                           'question', cq.question,
                                                           'minValue', cq.min_value,
                                                           'maxValue', cq.max_value,
                                                           'correctRange', cq.correct_range::json,
                                                           'unit', cq.unit
                                                   )
                                               END
                                       END
                                           ) FILTER (WHERE cq.id IS NOT NULL),
                                   '[]'::json
                   ) as quizzes

            FROM challenges c
                     LEFT JOIN challenge_references cr ON c.id = cr.challenge
                     LEFT JOIN challenge_quizzes cq ON c.id = cq.challenge
            WHERE c.milestone = ${milestoneId}
            GROUP BY c.id, c.milestone, c.challenge_title, c.objective, c.prerequisite_challenges,
                     c.builds_on_context, c.practice_instructions, c.assignment, c.submission_format,
                     c.success_criteria, c.memory_adaptations
            ORDER BY c.challenge_title
        `;

        // Transform the result to match the Challenge type structure
        return result.map((row: any) => ({
            id: row.id,
            milestone: row.milestone,
            challengeTitle: row.challenge_title,
            objective: row.objective,
            prerequisiteChallenges: row.prerequisite_challenges || [],
            buildsOnContext: row.builds_on_context,
            practiceInstructions: row.practice_instructions || [],
            assignment: row.assignment,
            submissionFormat: row.submission_format as 'video' | 'images' | 'audio' | 'text',
            references: Array.isArray(row.references) ? row.references : [],
            quizzes: Array.isArray(row.quizzes) ? row.quizzes : [],
            successCriteria: row.success_criteria,
            memoryAdaptations: row.memory_adaptations,
        }));
    };
}