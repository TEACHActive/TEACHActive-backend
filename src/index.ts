require('dotenv').config()

import express from 'express';
import axios, { AxiosResponse } from 'axios';
import { DateTime, Interval } from "luxon";
import { Canvas_Assignment, Canvas_Submission } from './types';

const app = express()
const port = 4000

app.get('/test', (req, res) => {
    res.send('Hello World!')
  })

/**
 * Ex class 72087
 * Ex assignment 1147291
 */
// app.get('/avg_grade/:courseId/:assignmentId/', (req, res) => {
//     const courseId : number = parseInt(req.params.courseId);
//     const assignmentId : number = parseInt(req.params.assignmentId);
//     const config = {
//         headers: { Authorization: `Bearer ${process.env.CANVAS_BEARER_TOKEN}` }
//     };

//     axios.get(`https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions?per_page=10&include[]=assignment`, config)
//     .then(function (response: any) {
//         // handle success
//         const jsonData = response.data;
        
//         console.log(response.data);
        
//         const scores = jsonData.filter((obj: any) => obj.workflow_state === "graded").map((obj: any) => obj.score);
//         const avgScore = scores.reduce((a: any, b: any) => a + b, 0)/scores.length;
     
//         const avgGrade = avgScore/jsonData[0].assignment.points_possible
//         console.log(avgGrade);
//         res.json(response.data);
//     })
//     .catch(function (error: any) {
//         // handle error
//         console.log(error);
//     })
    
// })

/**
 * 
 */
app.get('/avg_grade', async (req, res) => {
    const courseId : number = parseInt(req.query.courseId as string);
    const startDate : DateTime = DateTime.fromISO(req.query.startDateISO as string);
    const durationDays : number = parseInt(req.query.durationDays as string);
    // console.log(req.query.startDateISO + "|");
    
    const endDate = startDate.plus({days: durationDays});
    // console.log(endDate.toLocaleString(), startDate.toLocaleString());

    const maxNumAssignments = 100;
    const maxNumSubmissions = 100;

    const config = {
        headers: { Authorization: `Bearer ${process.env.CANVAS_BEARER_TOKEN}` }
    };

    try {
        const response = await axios.get(`https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments?per_page=${maxNumAssignments}`, config);
        const canvasAssignments: Canvas_Assignment[] = response.data.map((assignment: any) => new Canvas_Assignment(assignment));
        const canvasAssignmentsInRange: Canvas_Assignment[] = canvasAssignments.filter((assignment: Canvas_Assignment) => {
            if(!Interval.fromDateTimes(startDate, endDate).contains(assignment.due_at)) {
                return false;
            }
            return true;
        })

        console.log(canvasAssignmentsInRange.map((assign: Canvas_Assignment) => assign.id));
        

        const submissionPromises = canvasAssignmentsInRange.map((assignment: Canvas_Assignment) => 
            axios.get<Canvas_Submission[]>(`https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments/${assignment.id}/submissions?per_page=${maxNumSubmissions}&include[]=assignment`, config)
        )
        
        const resolvedSubmissionPromises = await Promise.all(submissionPromises);

        const assignmentScores = resolvedSubmissionPromises
        .map((rsp: AxiosResponse<Canvas_Submission[]>, i: number) => {
            const gradedScores = rsp.data.filter((submission: Canvas_Submission) => submission.workflow_state === "graded").map((submission: Canvas_Submission) => submission.score);
            const classPoints = gradedScores.reduce((a: number, b: number) => a + b, 0);
            const classPointsPossible = gradedScores.length * rsp.data[0].assignment!.points_possible;
            const assignmentName = rsp.data[0].assignment!.name;
            const assignmentDueDate = rsp.data[0].assignment!.due_at.toLocaleString();
            return {name: assignmentName, due: assignmentDueDate, averageGrade: classPoints/classPointsPossible};
        });


        res.json(assignmentScores);
    }
    catch(error) {
        res.json({"error": error});
        
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})