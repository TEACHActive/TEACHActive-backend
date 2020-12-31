require('dotenv').config()

import express from 'express';
import axios from 'axios';
import { DateTime, Interval } from "luxon";
import { inspect } from 'util'

const app = express()
const port = 4000

/**
 * Ex class 72087
 * Ex assignment 1147291
 */
app.get('/avg_grade/:courseId/:assignmentId', (req, res) => {
    const courseId : number = parseInt(req.params.courseId);
    const assignmentId : number = parseInt(req.params.assignmentId);
    const config = {
        headers: { Authorization: `Bearer ${process.env.CANVAS_BEARER_TOKEN}` }
    };

    axios.get(`https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions?per_page=10&include[]=assignment`, config)
    .then(function (response: any) {
        // handle success
        const jsonData = response.data;
        
        console.log(response.data);
        
        const scores = jsonData.filter((obj: any) => obj.workflow_state === "graded").map((obj: any) => obj.score);
        const avgScore = scores.reduce((a: any, b: any) => a + b, 0)/scores.length;
     
        const avgGrade = avgScore/jsonData[0].assignment.points_possible
        console.log(avgGrade);
        res.json(response.data);
    })
    .catch(function (error: any) {
        // handle error
        console.log(error);
    })
    
})

/**
 * 
 */
app.get('/avg_grade/:courseId/:startDateISO/:durationDays', async (req, res) => {
    const courseId : number = parseInt(req.params.courseId);
    const startDate : DateTime = DateTime.fromISO(req.params.startDateISO);
    const durationDays : number = parseInt(req.params.durationDays);
    
    
    const endDate = startDate.plus({days: durationDays});
    console.log(endDate.toLocaleString(), startDate.toLocaleString());

    const maxNumAssignments = 100;
    const maxNumSubmissions = 100;

    const config = {
        headers: { Authorization: `Bearer ${process.env.CANVAS_BEARER_TOKEN}` }
    };

    try {
        const response = await axios.get(`https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments?per_page=${maxNumAssignments}`, config);
        const assignmentsInRange = response.data.filter((assignment: any) => {
            const assignmentDueDate = DateTime.fromISO(assignment.due_at);
            if(!Interval.fromDateTimes(startDate, endDate).contains(assignmentDueDate)) {
                return false;
            }
            return true;
        })
        
        console.log("a", assignmentsInRange.length());
        const assignmentSubmissionPromises = assignmentsInRange.map((assignment: any): Promise<any> => 
            axios.get(`https://canvas.iastate.edu/api/v1/courses/${courseId}/assignments/${assignment.id}/submissions?per_page=${maxNumSubmissions}&include[]=assignment`, config)
        )
        
        
        console.log("here");
        
        const resolvedAssignmentSubmissions = await Promise.all(assignmentSubmissionPromises);
        res.json(resolvedAssignmentSubmissions);
        //resolvedAssignmentSubmissions.flat().map((submission: any) => )

    }
    catch(error: any) {

    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})