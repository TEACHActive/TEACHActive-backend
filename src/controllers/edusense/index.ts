import express from "express";
import multer from "multer";
import * as child from "child_process";
import mongoose from "mongoose";
import assert from "assert";

import { promiseFromChildProcess, read_directory } from "../../engine";
import {
  Channel,
  ClientVideoFrame,
  Person,
  VideoFrame,
} from "../../types/edusense.types";
import * as Const from "../../constants";
import { DateTime } from "luxon";
import { error } from "console";

const app = express();

const baseEndpoint = "/edusense";
const edusenseWorkingDir = Const.EDUSENSE_WORKING_DIR;
const outputDir = `${edusenseWorkingDir}/output`;
const dest = `${edusenseWorkingDir}/input`;
const upload = multer({ dest: dest });
const mongoURL = `mongodb://${Const.DB_HOST}:${Const.DB_PORT}/${Const.DB_NAME}`;

app.get(`${baseEndpoint}`, function (req, res) {
  console.log(`${baseEndpoint}`);
  res.end("Hello Edusense");
});

// const Schema = mongoose.Schema;
// const sessionSchema = new Schema({
//   frameNumber: Number,
//   timestamp: String,
//   people: [
//     {
//       body: [Number],
//       face: [Number],
//       hand: [Number],
//       openposeId: Number,
//       inference: {
//         posture: {
//           armPose: String,
//           sitStand: String,
//           centroidDelta: [Number],
//           armDelta: [Number],
//         },
//         face: {
//           boundingBox: [Number],
//           mouthOpen: String,
//           mouthSmile: String,
//           orentation: String,
//         },
//         head: {
//           roll: Number,
//           pitch: Number,
//           yaw: Number,
//           translationVector: [Number],
//           gazeVector: [Number],
//         },
//         trackingId: Number,
//       },
//     },
//   ],
//   channel: String,
// });
// const SessionModel = mongoose.model("Sesssion", sessionSchema);

// const testSchema = new Schema({
//   date: String,
//   i: Number,
// });
// const TestModel = mongoose.model("Test", testSchema);

// app.post(
//   `${baseEndpoint}/run_video`,
//   upload.single("video"),
//   async (req, res) => {
//     console.log(`${baseEndpoint}/run_video`);

//     const videoPath = req.file.path;
//     const fileType = req.body.fileType;
//     const uploadOnly: boolean =
//       (req.query.uploadOnly as string).toLowerCase() === "true";

//     child.exec(`rm -r ${outputDir}/*`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         console.log("Continuing...");
//       }
//       child.exec(
//         `mv ${videoPath} ${dest}/video.${fileType}`,
//         (error, stdout, stderr) => {
//           if (error) {
//             console.error(`exec error: ${error}`);
//             res.json({ error: error });
//             return;
//           }
//           if (uploadOnly) {
//             res.json({ videoPath: videoPath });
//             return;
//           }
//           const cmd =
//             "LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.file.yml up";
//           console.log("test run cmd");
//           child.exec(
//             cmd,
//             { cwd: edusenseWorkingDir },
//             (error, stdout, stderr) => {
//               if (error) {
//                 console.error(`exec error: ${error}`);
//                 res.json({ error: error });
//                 return;
//               }
//               // read_directory(outputDir).then(data => {
//               //     res.json(JSON.stringify(data));
//               // });
//               res.json({ success: "true" });
//             }
//           );
//         }
//       );
//     });

//     // //1. Delete video.avi file
//     // //2. Move this file to video.avi
//     // //3. Run compute yml cmd
//     // //4. Wait
//     // //5. Return all json output as one big json | return id of mongo db link
//     // const cmd = "sudo LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.yml";
//     // child.exec(cmd, (error, stdout, stderr) => {
//     // if (error) {
//     //     console.error(`exec error: ${error}`);
//     //     return;
//     // }
//     // console.log(`stdout: ${stdout}`);
//     // console.error(`stderr: ${stderr}`);
//     // });
//   }
// );

// app.get(`${baseEndpoint}/test`, upload.single("video"), async (req, res) => {
//   const videoPath = req.file.path;
//   // const fileType = req.body.fileType;
//   // if (fileType !== "avi") {
//   //   return res.status(400).send("only avi filetype accepted");
//   // }

//   // const cmd = `ffprobe -i ${videoPath} -show_entries format=duration -v quiet -of csv="p=0"`;
//   // const result = child.execSync(cmd).toString();
//   // res.send(parseInt(result));

//   // const allJSON = await read_directory(
//   //   "/home/jamkelley22/edusense/compose/output",
//   //   ".json"
//   // );

//   // const clientVideoFrames = allJSON.map((json: any) =>
//   //   new VideoFrame(json).toClient()
//   // );

//   // res.json(clientVideoFrames);
//   const allJSON = await read_directory(`${edusenseWorkingDir}/output`, ".json");

//   mongoose.connect(mongoURL, { useNewUrlParser: true });

//   let testDocs;
//   try {
//     testDocs = await (await SessionModel.collection.find()).toArray();
//   } catch (e) {
//     console.error(e);
//   }

//   // TestModel.collection.insertMany(
//   //   [
//   //     { date: new Date(), i: Math.random() * 1000 },
//   //     { date: new Date(), i: Math.random() * 1000 },
//   //   ],
//   //   (err, r) => {
//   //     // assert.strictEqual(null, err);
//   //     if (err) {
//   //       res.status(500).json({ error: err, r: r });
//   //       console.error(`mongoose error: ${err}`);
//   //     }
//   //     //  assert.strictEqual(3, r.insertedCount);
//   //     console.log(`Inserted ${r.insertedCount} records`);

//   //     mongoose.connection.close();
//   //   }
//   // );

//   res.json(testDocs);
// });

// app.post(
//   `${baseEndpoint}/run_pipeline`,
//   upload.single("video"),
//   async (req, res) => {
//     console.log(`${baseEndpoint}/run_pipeline`);

//     const isInstructorView: boolean =
//       (req.query.isInstructorView as string).toLowerCase() === "true";

//     console.log("isInstructorView", isInstructorView);

//     if (!req.file) {
//       res.status(400).send("No Video");
//       return;
//     }

//     const videoPath = req.file.path;
//     const videoLocation = req.file.destination;
//     const videoName = req.file.filename;
//     const fileType = req.body.fileType;

//     if (fileType !== "avi") {
//       return res.status(400).send("only avi filetype accepted");
//     }

//     const cmdGetUsername = "whoami";
//     const userName = child.execSync(cmdGetUsername).toString().trim();

//     console.log("whoami", userName);

//     const cmdGetUploadedVideoLengthInSeconds = `ffprobe -i ${videoPath} -show_entries format=duration -v quiet -of csv="p=0"`;
//     const videoLengthPaddingMultiplier = 1.2;
//     const uploadedVideoLengthInSeconds = parseInt(
//       child.execSync(cmdGetUploadedVideoLengthInSeconds).toString()
//     );

//     console.log(uploadedVideoLengthInSeconds);

//     const videoOpenposePipelineLogDirectory = `/home/${userName}/openpose_video_logs`;
//     const cmdEnsureVideoOpenposePipelineLogDirectory = `mkdir -p ${videoOpenposePipelineLogDirectory}`;
//     child.execSync(cmdEnsureVideoOpenposePipelineLogDirectory);

//     //Openpose and Video pipeline log dir need to be the same
//     // const openposePipelineLogDirectory = `/home/${userName}/openpose_video_logs`;
//     // const cmdEnsureOpenposePipelineLogDirectory = `mkdir -p ${openposePipelineLogDirectory}`;
//     // child.execSync(cmdEnsureOpenposePipelineLogDirectory);

//     //If empty will not output files
//     const videoPipelineOutputFileDirectory = `/home/${userName}/edusenseOutput`;
//     if (videoPipelineOutputFileDirectory) {
//       const cmdEnsureVideoPipelineOutputDirectory = `mkdir -p ${videoPipelineOutputFileDirectory}`;
//       child.execSync(cmdEnsureVideoPipelineOutputDirectory);
//     }

//     const videoPipelineDockerContainerTag = "jkelley:test_video";
//     const openposeDockerContainerTag = "jkelley:test_openpose";
//     const audioDockerContainerTag = "jkelley:test_audio";

//     const processRealTime = true;

//     //-----VideoPipeline Specific Args-----
//     //If empty will not pass schemaname
//     const videoPipelineSchemaName = "classinsight-graphql-video";
//     //If empty will not connect to storage server
//     const videoPipelineStorageServerBackendURL = "http://localhost:5000/";
//     const videoPipelineProfilePreformance = false;
//     //If empty will not output video
//     const videoPipelineVideoOutputName = "video.avi";
//     //If empty will not pass a sessionId
//     const videoPipelineEdusenseSessionId = "";
//     const videoPipelineProcessGaze = true;
//     const videoPipelineKeepFrameNumber = true;
//     const videoPipelineAreaOfIntrest = ""; //<x1> <y1> <x2> <y2>
//     const videoPipelineImageOut = true;
//     const videoPipelineJSONOut = true;

//     const numGraphicsCards = 2;

//     const cmdStartVideoPipeline = `nvidia-docker run \
//     --name ${userName}-video-${videoName} \
//     -e LOCAL_USER_ID=$(id -u) \
//     -e CUDA_VISIBLE_DEVICES=-1 \
//     -v ${videoOpenposePipelineLogDirectory}:/tmp \
//     -t \
//     -v ${videoLocation}:/app/source \
//     --rm \
//     ${videoPipelineDockerContainerTag} \
//     --video_sock /tmp/unix.front.sock \
//     ${videoPipelineSchemaName ? `--schema ${videoPipelineSchemaName}` : ""} \
//     --use_unix_socket \
//     ${videoPipelineKeepFrameNumber ? "--keep_frame_number" : ""} \
//     ${videoPipelineProcessGaze ? "--process_gaze" : ""} \
//     ${videoPipelineProfilePreformance ? "--profile" : ""} \
//     --time_duration ${Math.ceil(
//       uploadedVideoLengthInSeconds * videoLengthPaddingMultiplier
//     )} \
//     ${processRealTime ? "--process_real_time" : ""} \
//     --video /app/source/${videoName} \
    
    
    
//     ${
//       videoPipelineEdusenseSessionId
//         ? `--session_id ${videoPipelineEdusenseSessionId}`
//         : ""
//     } \
//     ${
//       videoPipelineAreaOfIntrest
//         ? `--area_of_interest ${videoPipelineAreaOfIntrest} `
//         : ""
//     } \
//     ${isInstructorView ? "--instructor" : ""} \
//     ${
//       videoPipelineStorageServerBackendURL
//         ? `--backend_url ${videoPipelineStorageServerBackendURL}`
//         : ""
//     } \
//     ${
//       videoPipelineVideoOutputName
//         ? `--video_out ${videoPipelineVideoOutputName}`
//         : ""
//     } \
//     ${
//       videoPipelineOutputFileDirectory
//         ? `--file_output_dir ${videoPipelineOutputFileDirectory}`
//         : ""
//     } \
//     ${videoPipelineImageOut ? "--image_out" : ""} \
//     ${videoPipelineJSONOut ? "--json_out" : ""}`;

//     const cmdStartOpenposePipeline = `nvidia-docker run \
//     --name ${userName}-openpose-${videoName} \
//     --rm \
//     -e LOCAL_USER_ID=$(id -u) \
//     -v ${videoOpenposePipelineLogDirectory}:/tmp \
//     -v ${videoLocation}:/app/video \
//     ${openposeDockerContainerTag} \
//     --video /app/video/${videoName} \
//     --num_gpu_start 0 \
//     --num_gpu ${numGraphicsCards} \
//     --use_unix_socket \
//     --unix_socket /tmp/unix.front.sock \
//     --display 0 \
//     --render_pose 0 \
//     --raw_image \
//     ${processRealTime ? "--process_real_time" : ""}`;

//     const cmdStartAudioPipeline = `docker run \
//     --name ${userName}-audio-${videoName} \
//     --rm \
//     -v ${videoLocation}:/app/source \
//     -t \
//     -v ${videoOpenposePipelineLogDirectory}:/tmp \
//     -e LOCAL_USER_ID=$(id -u) \
//     ${audioDockerContainerTag} \
//     --front_url /app/source/${videoName} \
//     --back_url /app/source/${videoName} \
//     --time_duration ${Math.ceil(
//       uploadedVideoLengthInSeconds * videoLengthPaddingMultiplier
//     )}`;
//     //Todo: differentate front and back video

//     console.log("start video pipeline");

//     const videoPipelineChild = child.exec(
//       cmdStartVideoPipeline,
//       (error, stdout, stderr) => {
//         if (error) {
//           console.error(`exec error: ${error}`);
//           res
//             .status(500)
//             .json({ error: error, stdout: stdout, stderr: stderr });
//           return Promise.resolve(error);
//         }
//         return Promise.resolve(stdout);
//       }
//     );

//     console.log("Start openpose pipeline");

//     const openposePipelineChild = child.exec(
//       cmdStartOpenposePipeline,
//       (error, stdout, stderr) => {
//         if (error) {
//           res
//             .status(500)
//             .json({ error: error, stdout: stdout, stderr: stderr });
//           console.error(`exec error: ${error}`);
//           // return;
//         }
//       }
//     );

//     console.log("start audio pipeline");

//     const audioPipelineChild = child.exec(
//       cmdStartAudioPipeline,
//       (error, stdout, stderr) => {
//         if (error) {
//           console.error(`exec error: ${error}`);
//           // res.status(500).send(error);
//           // return;
//         }
//       }
//     );

//     await Promise.all([
//       promiseFromChildProcess(videoPipelineChild),
//       promiseFromChildProcess(openposePipelineChild),
//       // promiseFromChildProcess(audioPipelineChild),
//     ]);

//     const allJSON = await read_directory(
//       videoPipelineOutputFileDirectory,
//       ".json"
//     );

//     const clientVideoFrames = allJSON.map((json: any) =>
//       new VideoFrame(json).toClient()
//     );

//     console.log("Mongoose");

//     mongoose.connect(mongoURL, { useNewUrlParser: true });

//     // let testDocs;
//     // try {
//     //   testDocs = await (await TestModel.collection.find()).toArray();
//     // } catch (e) {
//     //   console.error(e);
//     // }

//     // TestModel.collection.insertMany(
//     //   [
//     //     { date: new Date(), i: Math.random() * 1000 },
//     //     { date: new Date(), i: Math.random() * 1000 },
//     //   ],
//     //   (err, r) => {
//     //     // assert.strictEqual(null, err);
//     //     if (err) {
//     //       res.status(500).json({ error: err, r: r });
//     //       console.error(`mongoose error: ${err}`);
//     //     }
//     //     //  assert.strictEqual(3, r.insertedCount);
//     //     console.log(`Inserted ${r.insertedCount} records`);

//     //     mongoose.connection.close();
//     //   }
//     // );

//     console.log("#allJSON", allJSON.length);
//     console.log("#clientVideoFrames", clientVideoFrames.length);

//     SessionModel.collection.insertMany(clientVideoFrames, (err, r) => {
//       // assert.strictEqual(null, err);
//       if (err) {
//         res.status(500).json({ error: err, r: r });
//         console.error(`mongoose error: ${err}`);
//       }
//       //  assert.strictEqual(3, r.insertedCount);
//       console.log(`Inserted ${r.insertedCount} records`);

//       mongoose.connection.close();
//     });

//     // const result = child.execSync(cmdStartVideoPipeline);

//     // //Remove all files from output directory from previous runs
//     // child.exec(`rm -r ${outputDir}/*`, (error, stdout, stderr) => {
//     //   if (error) {
//     //     console.error(`exec error: ${error}`);
//     //     console.log("Continuing...");
//     //   }
//     //   child.exec(
//     //     `mv ${videoPath} ${dest}/video.${fileType}`,
//     //     (error, stdout, stderr) => {
//     //       if (error) {
//     //         console.error(`exec error: ${error}`);
//     //         res.json({ error: error });
//     //         return;
//     //       }
//     //       const cmd =
//     //         "LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.file.yml up";
//     //       console.log("test run cmd");
//     //       child.exec(
//     //         cmd,
//     //         { cwd: edusenseWorkingDir },
//     //         (error, stdout, stderr) => {
//     //           if (error) {
//     //             console.error(`exec error: ${error}`);
//     //             res.json({ error: error });
//     //             return;
//     //           }
//     //           // read_directory(outputDir).then(data => {
//     //           //     res.json(JSON.stringify(data));
//     //           // });
//     //           res.json({ success: "true" });
//     //         }
//     //       );
//     //     }
//     //   );
//     // });

//     // //1. Delete video.avi file
//     // //2. Move this file to video.avi
//     // //3. Run compute yml cmd
//     // //4. Wait
//     // //5. Return all json output as one big json | return id of mongo db link
//     // const cmd = "sudo LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.yml";
//     // child.exec(cmd, (error, stdout, stderr) => {
//     // if (error) {
//     //     console.error(`exec error: ${error}`);
//     //     return;
//     // }
//     // console.log(`stdout: ${stdout}`);
//     // console.error(`stderr: ${stderr}`);
//     // });
//   }
// );

export { app as edusense };
