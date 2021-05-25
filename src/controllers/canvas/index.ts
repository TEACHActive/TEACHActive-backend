import axios, { AxiosResponse } from "axios";
import express from "express";
import { DateTime, Interval } from "luxon";
import path from "path";
import { Canvas_Assignment, Canvas_Submission } from "./canvas.types";

const app = express();

const baseEndpoint = "/canvas";
// const canavasFolder = '../../../data/Accolades';
// const canavasFileJSON = '/accolades.json';

app.get(`${baseEndpoint}`, function (req, res) {
  res.end("Hello Canvas");
});

/**
 *
 */
app.get(`${baseEndpoint}/avg_grade`, async (req, res) => {
  const courseId: number = parseInt(req.query.courseId as string);
  const startDate: DateTime = DateTime.fromISO(
    req.query.startDateISO as string
  );
  const durationDays: number = parseInt(req.query.durationDays as string);

  const endDate = startDate.plus({ days: durationDays });

  const maxNumAssignments = 100;
  const maxNumSubmissions = 100;

  const config = {
    headers: { Authorization: `Bearer ${process.env.CANVAS_BEARER_TOKEN}` },
  };

  try {
    const response = await axios.get(
      `https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments?per_page=${maxNumAssignments}`,
      config
    );
    const canvasAssignments: Canvas_Assignment[] = response.data.map(
      (assignment: any) => new Canvas_Assignment(assignment)
    );
    const canvasAssignmentsInRange: Canvas_Assignment[] = canvasAssignments.filter(
      (assignment: Canvas_Assignment) => {
        if (
          !Interval.fromDateTimes(startDate, endDate).contains(
            assignment.due_at
          )
        ) {
          return false;
        }
        return true;
      }
    );

    const submissionPromises = canvasAssignmentsInRange.map(
      (assignment: Canvas_Assignment) =>
        axios.get<Canvas_Submission[]>(
          `https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments/${assignment.id}/submissions?per_page=${maxNumSubmissions}&include[]=assignment`,
          config
        )
    );

    const resolvedSubmissionPromises = await Promise.all(submissionPromises);

    const assignmentScores = resolvedSubmissionPromises.map(
      (rsp: AxiosResponse<Canvas_Submission[]>, i: number) => {
        const gradedScores = rsp.data
          .filter(
            (submission: Canvas_Submission) =>
              submission.workflow_state === "graded"
          )
          .map((submission: Canvas_Submission) => submission.score);
        const classPoints = gradedScores.reduce(
          (a: number, b: number) => a + b,
          0
        );
        const classPointsPossible =
          gradedScores.length * rsp.data[0].assignment!.points_possible;
        const assignmentName = rsp.data[0].assignment!.name;
        const assignmentDueDate = rsp.data[0].assignment!.due_at.toLocaleString();
        return {
          name: assignmentName,
          due: assignmentDueDate,
          averageGrade: classPoints / classPointsPossible,
        };
      }
    );

    res.json(assignmentScores);
  } catch (error) {
    res.json({ error: error });
  }
});

export { app as canvas };
