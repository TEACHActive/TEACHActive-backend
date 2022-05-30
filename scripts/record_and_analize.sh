#!/bin/bash
#set -x #echo on

# ex:
# ./backfill /home/jkelley/TEACHActive_Videos/ <FIREBASE_UID> 5 6 00:50:00 SICTR_0114 <email>

#1 Video dir
VideoDir=$1
#2 FIREBASE_UID of Prof
FIREBASE_UID=$2
#3 Camera num Front
CameraNumFront=$3
#4 Camera num Back
CameraNumBack=$4
#5 Duration #00:50:00
Duration=$5
#6 Classroom Name
ClassroomName=$6
#7 Email
Email=$7
#8,9,10,11 Instructor Area for back camera (no longer cropping so no longer needed)
# X1=$8
# Y1=$9
# Width=${10}
# Height=${11}
CameraType=$8


SENDGRID_API_KEY='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'
FROM_EMAIL="jkelley@iastate.edu"


if [[ $# -ne 8 ]]; then
  curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [
      {
        "to": [
          {
            "email": "jkelley@iastate.edu"
          }
        ]
      },
      {
        "to": [
         {
                "email": "dalzoubi@iastate.edu"
         }
        ]
      }
    ],
    "from": {
      "email": "jkelley@iastate.edu"
    },
    "subject": "Backfill script failed",
    "content": [
      {
        "type": "text/plain", 
        "value": "'"$FIREBASE_UID, $ClassroomName"'"
      }
    ]}'
  exit 1
fi

folder_path=$VideoDir$ClassroomName/$FIREBASE_UID

mkdir -p $folder_path

# Front Record
front_video_name="$ClassroomName"_"$FIREBASE_UID"_`date +%y-%m-%d_%s`--Front.mp4
ffmpeg -i rtsp://admin:Screen_lamp_snow@"$CameraType"-cam"$CameraNumFront".its.iastate.edu/ -acodec copy -vcodec copy -t "$5" "$folder_path/$front_video_name" &

# Back Record
back_video_name="$ClassroomName"_"$FIREBASE_UID"_`date +%y-%m-%d_%s`--Back.mp4
ffmpeg -i rtsp://admin:Screen_lamp_snow@"$CameraType"-cam"$CameraNumBack".its.iastate.edu/ -acodec copy -vcodec copy -t "$5" "$folder_path/$back_video_name" &

wait

time_str_front="`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $folder_path/$back_video_name`"

time_front="`printf "%.0f" $time_str_front`"

# Trim instrctor video (no longer necessary, using privacy filters on cameras)
# ffmpeg -i "$folder_path/$back_video_name" -filter:v "crop=$Width:$Height:$X1:$X2" -c:a copy "$folder_path/cropped--$back_video_name"
# --back_video "cropped--$back_video_name" \

{

APP_USERNAME=edusense APP_PASSWORD=5i6iJ%rrudSQS36LKs6U python3 /home/jkelley/edusense3/edusense/scripts/run_backfill.py \
--front_video "$front_video_name" \
--developer jkelley \
--back_video "$back_video_name" \
--keyword "$FIREBASE_UID" \
--front_num_gpu_start 0 \
--front_num_gpu 1 \
--back_num_gpu_start 1 \
--back_num_gpu 1 \
--time_duration $time_front \
--video_schema 0.1.0 \
--audio_schema 0.1.0 \
--video_dir  "$folder_path" \
--backend_url localhost:5000 \ # Changed from "teachactive.engineering.iastate.edu:5000"
--log_dir /home/jkelley/edusense3/edusense/logs \
--process_real_time 
} || {
  curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [
      {
        "to": [
          {
            "email": "jkelley@iastate.edu"
          }
        ]
      },
      {
        "to": [
         {
                "email": "dalzoubi@iastate.edu"
         }
        ]
      }
    ],
    "from": {
      "email": "jkelley@iastate.edu"
    },
    "subject": "Backfill script failed",
    "content": [
      {
        "type": "text/plain", 
        "value": "'"$FIREBASE_UID, $ClassroomName"'"
      }
    ]}'
  exit 1
}


curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [
      {
        "to": [
          {
            "email": "'"$EMAIL"'"
          },
        ]
      },
      {
        "to": [
         {
                "email": "jkelley@iastate.edu"
         }
        ]
      },
      {
        "to": [
         {
                "email": "dalzoubi@iastate.edu"
         }
        ]
      }
    ],
    "from": {
      "email": "jkelley@iastate.edu"
    },
    "subject": "Your latest TEACHActive session analysis is ready!",
    "content": [
      {
        "type": "text/plain", 
        "value": "View your latest TEACHActive session at https://teachactive.engineering.iastate.edu/v2/build"
      }
    ]}'
