"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas_Course = exports.Canvas_Enrollment = exports.Canvas_Calendar = exports.Canvas_Submission = exports.Canvas_Attachment = exports.Canvas_Assignment = void 0;
var luxon_1 = require("luxon");
var Canvas_Assignment = /** @class */ (function () {
    function Canvas_Assignment(data) {
        this.id = data.id;
        this.description = data.description;
        this.due_at = luxon_1.DateTime.fromISO(data.due_at);
        this.unlock_at = luxon_1.DateTime.fromISO(data.unlock_at);
        this.lock_at = luxon_1.DateTime.fromISO(data.lock_at);
        this.points_possible = data.points_possible;
        this.grading_type = data.grading_type;
        this.assignment_group_id = data.assignment_group_id;
        this.grading_standard_id = data.grading_standard_id;
        this.created_at = luxon_1.DateTime.fromISO(data.created_at);
        this.updated_at = luxon_1.DateTime.fromISO(data.updated_at);
        this.peer_reviews = data.peer_reviews;
        this.automatic_peer_reviews = data.automatic_peer_reviews;
        this.position = data.position;
        this.grade_group_students_individually = data.grade_group_students_individually;
        this.anonymous_peer_reviews = data.anonymous_peer_reviews;
        this.group_category_id = data.group_category_id;
        this.post_to_sis = data.post_to_sis;
        this.moderated_grading = data.moderated_grading;
        this.omit_from_final_grade = data.omit_from_final_grade;
        this.intra_group_peer_reviews = data.intra_group_peer_reviews;
        this.anonymous_instructor_annotations = data.anonymous_instructor_annotations;
        this.anonymous_grading = data.anonymous_grading;
        this.graders_anonymous_to_graders = data.graders_anonymous_to_graders;
        this.grader_count = data.grader_count;
        this.grader_comments_visible_to_graders = data.grader_comments_visible_to_graders;
        this.final_grader_id = data.final_grader_id;
        this.grader_names_visible_to_final_grader = data.grader_names_visible_to_final_grader;
        this.allowed_attempts = data.allowed_attempts;
        this.secure_params = data.secure_params;
        this.course_id = data.course_id;
        this.name = data.name;
        this.submission_types = data.submission_types;
        this.has_submitted_submissions = data.has_submitted_submissions;
        this.due_date_required = data.due_date_required;
        this.max_name_length = data.max_name_length;
        this.in_closed_grading_period = data.in_closed_grading_period;
        this.is_quiz_assignment = data.is_quiz_assignment;
        this.can_duplicate = data.can_duplicate;
        this.original_course_id = data.original_course_id;
        this.original_assignment_id = data.original_assignment_id;
        this.original_assignment_name = data.original_assignment_name;
        this.original_quiz_id = data.original_quiz_id;
        this.workflow_state = data.workflow_state;
        this.muted = data.muted;
        this.html_url = data.html_url;
        this.has_overrides = data.has_overrides;
        this.needs_grading_count = data.needs_grading_count;
        this.sis_assignment_id = data.sis_assignment_id;
        this.integration_id = data.integration_id;
        this.integration_data = data.integration_datastring;
        this.quiz_id = data.quiz_id;
        this.anonymous_submissions = data.anonymous_submissions;
        this.published = data.published;
        this.unpublishable = data.unpublishable;
        this.only_visible_to_overrides = data.only_visible_to_overrides;
        this.locked_for_user = data.locked_for_user;
        this.submissions_download_url = data.submissions_download_url;
        this.post_manually = data.post_manually;
        this.anonymize_students = data.anonymize_students;
        this.require_lockdown_browser = data.require_lockdown_browser;
    }
    return Canvas_Assignment;
}());
exports.Canvas_Assignment = Canvas_Assignment;
var Canvas_Attachment = /** @class */ (function () {
    function Canvas_Attachment(data) {
        this.id = data.id;
        this.uuid = data.uuid;
        this.folder_id = data.folder_id;
        this.display_name = data.display_name;
        this.filename = data.filename;
        this.upload_status = data.upload_status;
        this.content_type = data['content-type'];
        this.url = data.url;
        this.size = data.size;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.unlock_at = data.unlock_at;
        this.locked = data.locked;
        this.hidden = data.hidden;
        this.lock_at = data.lock_at;
        this.hidden_for_user = data.hidden_for_user;
        this.thumbnail_url = data.thumbnail_url;
        this.modified_at = data.modified_at;
        this.mime_class = data.mime_class;
        this.media_entry_id = data.media_entry_id;
        this.locked_for_user = data.locked_for_user;
        this.preview_url = data.preview_url;
    }
    return Canvas_Attachment;
}());
exports.Canvas_Attachment = Canvas_Attachment;
var Canvas_Submission = /** @class */ (function () {
    function Canvas_Submission(data) {
        this.id = data.id;
        this.body = data.body;
        this.url = data.url;
        this.grade = data.grade;
        this.score = data.score;
        this.submitted_at = data.submitted_at;
        this.assignment_id = data.assignment_id;
        this.user_id = data.user_id;
        this.submission_type = data.submission_type;
        this.workflow_state = data.workflow_state;
        this.grade_matches_current_submission = data.grade_matches_current_submission;
        this.graded_at = data.graded_at;
        this.grader_id = data.grader_id;
        this.attempt = data.attempt;
        this.cached_due_date = data.cached_due_date;
        this.excused = data.excused;
        this.late_policy_status = data.late_policy_status;
        this.points_deducted = data.points_deducted;
        this.grading_period_id = data.grading_period_id;
        this.extra_attempts = data.extra_attempts;
        this.posted_at = data.posted_at;
        this.late = data.late;
        this.missing = data.missing;
        this.seconds_late = data.seconds_late;
        this.entered_grade = data.entered_grade;
        this.entered_score = data.entered_score;
        this.preview_url = data.preview_url;
        if (data.attachments)
            this.attachments = data.attachments.map(function (attachment) { return new Canvas_Attachment(attachment); });
        if (data.assignment)
            this.assignment = new Canvas_Assignment(data.assignment);
    }
    return Canvas_Submission;
}());
exports.Canvas_Submission = Canvas_Submission;
var Canvas_Calendar = /** @class */ (function () {
    function Canvas_Calendar(data) {
        this.ics = data.ics;
    }
    return Canvas_Calendar;
}());
exports.Canvas_Calendar = Canvas_Calendar;
var Canvas_Enrollment = /** @class */ (function () {
    function Canvas_Enrollment(data) {
        this.type = data.type;
        this.role = data.role;
        this.role_id = data.role_id;
        this.user_id = data.user_id;
        this.enrollment_state = data.enrollment_state;
        this.limit_privileges_to_course_section = data.limit_privileges_to_course_section;
    }
    return Canvas_Enrollment;
}());
exports.Canvas_Enrollment = Canvas_Enrollment;
var Canvas_Course = /** @class */ (function () {
    function Canvas_Course(data) {
        this.id = data.id;
        this.name = data.name;
        this.account_id = data.account_id;
        this.uuid = data.uuid;
        this.start_at = luxon_1.DateTime.fromISO(data.start_at);
        this.grading_standard_id = data.grading_standard_id;
        this.is_public = data.is_public;
        this.created_at = luxon_1.DateTime.fromISO(data.created_at);
        this.course_code = data.course_code;
        this.default_view = data.default_view;
        this.root_account_id = data.root_account_id;
        this.enrollment_term_id = data.enrollment_term_id;
        this.license = data.license;
        this.grade_passback_setting = data.grade_passback_setting;
        this.end_at = luxon_1.DateTime.fromISO(data.end_at);
        this.public_syllabus = data.public_syllabus;
        this.public_syllabus_to_auth = data.public_syllabus_to_auth;
        this.storage_quota_mb = data.storage_quota_mb;
        this.is_public_to_auth_users = data.is_public_to_auth_users;
        this.apply_assignment_group_weights = data.apply_assignment_group_weights;
        if (data.calendar)
            this.calendar = data.calendar;
        this.time_zone = data.time_zone;
        this.blueprint = data.blueprint;
        if (data.enrollments)
            this.enrollments = data.enrollments;
        this.hide_final_grades = data.hide_final_grades;
        this.workflow_state = data.workflow_state;
        this.course_format = data.course_format;
        this.restrict_enrollments_to_course_dates = data.restrict_enrollments_to_course_dates;
    }
    return Canvas_Course;
}());
exports.Canvas_Course = Canvas_Course;
