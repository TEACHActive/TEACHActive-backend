# File
# UserUID

import argparse

parser = argparse.ArgumentParser(description='Analize previous recordings automatically.')
parser.add_argument('--base_filenames', nargs='+', help='full paths leading to the base file names to be analized (not including --Front or --Back')
parser.add_argument('--uid')
args = parser.parse_args()



'''
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
'''