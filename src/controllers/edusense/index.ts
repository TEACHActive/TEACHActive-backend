import express from "express";
import multer from "multer";
import * as child from "child_process";
import { promiseFromChildProcess, read_directory } from "../../engine";

const app = express();

const baseEndpoint = "/edusense";
const edusenseWorkingDir = "/home/jamkelley22/edusense/compose";
const outputDir = `${edusenseWorkingDir}/output`;
const dest = `${edusenseWorkingDir}/input`;
const upload = multer({ dest: dest });

app.get(`${baseEndpoint}`, function (req, res) {
  console.log(`${baseEndpoint}`);
  res.end("Hello Edusense");
});

app.post(
  `${baseEndpoint}/run_video`,
  upload.single("video"),
  async (req, res) => {
    console.log(`${baseEndpoint}/run_video`);

    const videoPath = req.file.path;
    const fileType = req.body.fileType;
    const uploadOnly: boolean =
      (req.query.uploadOnly as string).toLowerCase() === "true";

    child.exec(`rm -r ${outputDir}/*`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.log("Continuing...");
      }
      child.exec(
        `mv ${videoPath} ${dest}/video.${fileType}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            res.json({ error: error });
            return;
          }
          if (uploadOnly) {
            res.json({ videoPath: videoPath });
            return;
          }
          const cmd =
            "LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.file.yml up";
          console.log("test run cmd");
          child.exec(
            cmd,
            { cwd: edusenseWorkingDir },
            (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                res.json({ error: error });
                return;
              }
              // read_directory(outputDir).then(data => {
              //     res.json(JSON.stringify(data));
              // });
              res.json({ success: "true" });
            }
          );
        }
      );
    });

    // //1. Delete video.avi file
    // //2. Move this file to video.avi
    // //3. Run compute yml cmd
    // //4. Wait
    // //5. Return all json output as one big json | return id of mongo db link
    // const cmd = "sudo LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.yml";
    // child.exec(cmd, (error, stdout, stderr) => {
    // if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    // }
    // console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
    // });
  }
);

app.get(`${baseEndpoint}/test`, upload.single("video"), async (req, res) => {
  const videoPath = req.file.path;
  // const fileType = req.body.fileType;
  // if (fileType !== "avi") {
  //   return res.status(400).send("only avi filetype accepted");
  // }

  // const cmd = `ffprobe -i ${videoPath} -show_entries format=duration -v quiet -of csv="p=0"`;
  // const result = child.execSync(cmd).toString();
  // res.send(parseInt(result));

  const allJSON = await read_directory(
    "/home/jamkelley22/edusense/compose/output",
    ".json"
  );

  allJSON.map((json: any, i: number) => {});

  res.json();
});

app.post(
  `${baseEndpoint}/run_pipeline`,
  upload.single("video"),
  async (req, res) => {
    console.log(`${baseEndpoint}/run_pipeline`);

    const isInstructorView: boolean =
      (req.query.isInstructorView as string).toLowerCase() === "true";

    const videoPath = req.file.path;
    const videoLocation = req.file.destination;
    const videoName = req.file.filename;
    const fileType = req.body.fileType;

    if (fileType !== "avi") {
      return res.status(400).send("only avi filetype accepted");
    }

    const cmdGetUsername = "whoami";
    const userName = child.execSync(cmdGetUsername).toString().trim();

    const cmdGetUploadedVideoLengthInSeconds = `ffprobe -i ${videoPath} -show_entries format=duration -v quiet -of csv="p=0"`;
    const videoLengthPaddingMultiplier = 1.2;
    const uploadedVideoLengthInSeconds = parseInt(
      child.execSync(cmdGetUploadedVideoLengthInSeconds).toString()
    );

    const videoPipelineLogDirectory = `/home/${userName}/openpose_video_logs`;
    const cmdEnsureVideoPipelineLogDirectory = `mkdir -p ${videoPipelineLogDirectory}`;
    child.execSync(cmdEnsureVideoPipelineLogDirectory);

    const openposePipelineLogDirectory = `/home/${userName}/openpose_video_logs`;
    const cmdEnsureOpenposePipelineLogDirectory = `mkdir -p ${openposePipelineLogDirectory}`;
    child.execSync(cmdEnsureOpenposePipelineLogDirectory);

    //If empty will not output files
    const videoPipelineOutputFileDirectory = `/home/${userName}/edusenseOutput`;
    if (videoPipelineOutputFileDirectory) {
      const cmdEnsureVideoPipelineOutputDirectory = `mkdir -p ${videoPipelineOutputFileDirectory}`;
      child.execSync(cmdEnsureVideoPipelineOutputDirectory);
    }

    const videoPipelineDockerContainerTag = "compose_video:latest";
    const openposeDockerContainerTag = "compose_openpose:latest";
    const audioDockerContainerTag = "edusense/audio:latest";

    const processRealTime = true;

    //-----VideoPipeline Specific Args-----
    //If empty will not pass schemaname
    const videoPipelineSchemaName = "classinsight-graphql-video";
    //If empty will not connect to storage server
    const videoPipelineStorageServerBackendURL = "http://localhost:5000/";
    const videoPipelineProfilePreformance = false;
    //If empty will not output video
    const videoPipelineVideoOutputName = "video.avi";
    //If empty will not pass a sessionId
    const videoPipelineEdusenseSessionId = "";
    const videoPipelineProcessGaze = true;
    const videoPipelineKeepFrameNumber = true;
    const videoPipelineAreaOfIntrest = ""; //<x1> <y1> <x2> <y2>
    const videoPipelineImageOut = true;
    const videoPipelineJSONOut = true;

    const numGraphicsCards = 2;

    const cmdStartVideoPipeline = `nvidia-docker run \
    --video /app/source/${videoName} \
    --video_sock /tmp/unix.front.sock \
    ${
      videoPipelineStorageServerBackendURL
        ? `--backend_url ${videoPipelineStorageServerBackendURL}`
        : ""
    } \
    ${
      videoPipelineOutputFileDirectory
        ? `--file_output_dir ${videoPipelineOutputFileDirectory}`
        : ""
    } \
    ${
      videoPipelineEdusenseSessionId
        ? `--session_id ${videoPipelineEdusenseSessionId}`
        : ""
    } \
    ${videoPipelineSchemaName ? `--schema ${videoPipelineSchemaName}` : ""} \
    --time_duration ${
      uploadedVideoLengthInSeconds * videoLengthPaddingMultiplier
    } \
    ${processRealTime ? "--process_real_time" : ""} \
    ${videoPipelineProcessGaze ? "--process_gaze" : ""} \
    ${videoPipelineKeepFrameNumber ? "--keep_frame_number" : ""} \
    ${
      videoPipelineAreaOfIntrest
        ? `--area_of_interest ${videoPipelineAreaOfIntrest} `
        : ""
    } \
    ${videoPipelineProfilePreformance ? "--profile" : ""} \
    ${isInstructorView ? "--instructor" : ""}
    ${
      videoPipelineVideoOutputName
        ? `--video_out ${videoPipelineVideoOutputName}`
        : ""
    } \
    ${videoPipelineImageOut ? "--image_out" : ""} \
    ${videoPipelineJSONOut ? "--json_out" : ""} \
    --use_unix_socket \
    --name ${userName}-video-${videoName} \
    -e LOCAL_USER_ID=$(id -u) \
    -e CUDA_VISIBLE_DEVICES=-1 \
    -v ${videoPipelineLogDirectory}:/tmp \
    -t \
    -v ${videoLocation}:/app/source \
    --rm \
    ${videoPipelineDockerContainerTag} \
    `;

    const cmdStartOpenposePipeline = `nvidia-docker run \
    --name ${userName}-openpose-${videoName} \
    --rm \
    -e LOCAL_USER_ID=$(id -u) \
    -v ${openposePipelineLogDirectory}:/tmp \
    -v ${videoLocation}:/app/video \
    ${openposeDockerContainerTag} \
    --video /app/video/${videoName} \
    --num_gpu_start 0 \
    --num_gpu ${numGraphicsCards} \
    --use_unix_socket \
    --unix_socket /tmp/unix.front.sock \
    --display 0 \
    --render_pose 0 \
    --raw_image \
    ${processRealTime ? "--process_real_time" : ""}`;

    const cmdStartAudioPipeline = `docker run \
    --name ${userName}-audio-${videoName} \
    --rm \
    -v ${videoLocation}:/app/source \
    -t \
    -v ${openposePipelineLogDirectory}:/tmp \
    -e LOCAL_USER_ID=$(id -u) \
    ${audioDockerContainerTag} \
    --front_url /app/source/${videoName} \
    --back_url /app/source/${videoName} \
    --time_duration ${
      uploadedVideoLengthInSeconds * videoLengthPaddingMultiplier
    }`;
    //Todo: differentate front and back video

    const videoPipelineChild = child.exec(
      cmdStartVideoPipeline,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return Promise.resolve(error);
          // res.status(500).send(error);
          // return;
        }
        return Promise.resolve(stdout);
      }
    );
    const openposePipelineChild = child.exec(
      cmdStartOpenposePipeline,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          // res.status(500).send(error);
          // return;
        }
      }
    );
    const audioPipelineChild = child.exec(
      cmdStartAudioPipeline,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          // res.status(500).send(error);
          // return;
        }
      }
    );

    await Promise.all([
      promiseFromChildProcess(videoPipelineChild),
      promiseFromChildProcess(openposePipelineChild),
      promiseFromChildProcess(audioPipelineChild),
    ]);

    // const result = child.execSync(cmdStartVideoPipeline);

    // //Remove all files from output directory from previous runs
    // child.exec(`rm -r ${outputDir}/*`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`exec error: ${error}`);
    //     console.log("Continuing...");
    //   }
    //   child.exec(
    //     `mv ${videoPath} ${dest}/video.${fileType}`,
    //     (error, stdout, stderr) => {
    //       if (error) {
    //         console.error(`exec error: ${error}`);
    //         res.json({ error: error });
    //         return;
    //       }
    //       const cmd =
    //         "LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.file.yml up";
    //       console.log("test run cmd");
    //       child.exec(
    //         cmd,
    //         { cwd: edusenseWorkingDir },
    //         (error, stdout, stderr) => {
    //           if (error) {
    //             console.error(`exec error: ${error}`);
    //             res.json({ error: error });
    //             return;
    //           }
    //           // read_directory(outputDir).then(data => {
    //           //     res.json(JSON.stringify(data));
    //           // });
    //           res.json({ success: "true" });
    //         }
    //       );
    //     }
    //   );
    // });

    // //1. Delete video.avi file
    // //2. Move this file to video.avi
    // //3. Run compute yml cmd
    // //4. Wait
    // //5. Return all json output as one big json | return id of mongo db link
    // const cmd = "sudo LOCAL_USER_ID=$(id -u) docker-compose -f docker-compose.compute.yml";
    // child.exec(cmd, (error, stdout, stderr) => {
    // if (error) {
    //     console.error(`exec error: ${error}`);
    //     return;
    // }
    // console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
    // });
  }
);

export { app as edusense };
