import { DateTime } from "luxon";

export class Canvas_Assignment {
    id: number;
    description: string;
    due_at: DateTime;
    unlock_at?: DateTime;
    lock_at?: DateTime;
    points_possible: number;
    grading_type: string;
    assignment_group_id: number;
    grading_standard_id?: any;
    created_at: DateTime;
    updated_at: DateTime;
    peer_reviews: boolean;
    automatic_peer_reviews: boolean;
    position: number;
    grade_group_students_individually: boolean;
    anonymous_peer_reviews: boolean;
    group_category_id?: any;
    post_to_sis: boolean;
    moderated_grading: boolean;
    omit_from_final_grade: boolean;
    intra_group_peer_reviews: boolean;
    anonymous_instructor_annotations: boolean;
    anonymous_grading: boolean;
    graders_anonymous_to_graders: boolean;
    grader_count: number;
    grader_comments_visible_to_graders: boolean;
    final_grader_id?: any;
    grader_names_visible_to_final_grader: boolean;
    allowed_attempts: number;
    secure_params: string;
    course_id: number;
    name: string;
    submission_types: string[];
    has_submitted_submissions: boolean;
    due_date_required: boolean;
    max_name_length: number;
    in_closed_grading_period: boolean;
    is_quiz_assignment: boolean;
    can_duplicate: boolean;
    original_course_id?: any;
    original_assignment_id?: any;
    original_assignment_name?: any;
    original_quiz_id?: any;
    workflow_state: string;
    muted: boolean;
    html_url: string;
    has_overrides: boolean;
    needs_grading_count: number;
    sis_assignment_id?: any;
    integration_id?: any;
    integration_data: object;
    quiz_id: number;
    anonymous_submissions: boolean;
    published: boolean;
    unpublishable: boolean;
    only_visible_to_overrides: boolean;
    locked_for_user: boolean;
    submissions_download_url: string;
    post_manually: boolean;
    anonymize_students: boolean;
    require_lockdown_browser: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.description = data.description;
        this.due_at = DateTime.fromISO(data.due_at);
        this.unlock_at = DateTime.fromISO(data.unlock_at);
        this.lock_at = DateTime.fromISO(data.lock_at);
        this.points_possible = data.points_possible;
        this.grading_type = data.grading_type;
        this.assignment_group_id = data.assignment_group_id;
        this.grading_standard_id = data.grading_standard_id;
        this.created_at = DateTime.fromISO(data.created_at);
        this.updated_at = DateTime.fromISO(data.updated_at);
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
}

export class Canvas_Attachment {
    id: number;
    uuid: string;
    folder_id: number;
    display_name: string;
    filename: string;
    upload_status: string;
    content_type: string;
    url: string;
    size: number;
    created_at: Date;
    updated_at: Date;
    unlock_at?: any;
    locked: boolean;
    hidden: boolean;
    lock_at?: any;
    hidden_for_user: boolean;
    thumbnail_url?: any;
    modified_at: Date;
    mime_class: string;
    media_entry_id?: any;
    locked_for_user: boolean;
    preview_url?: any;

    constructor(data: any) {
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
}

export class Canvas_Submission {
    id: number;
    body?: any;
    url?: any;
    grade: string;
    score: number;
    submitted_at: DateTime;
    assignment_id: number;
    user_id: number;
    submission_type: string;
    workflow_state: string;
    grade_matches_current_submission: boolean;
    graded_at: DateTime;
    grader_id: number;
    attempt: number;
    cached_due_date: DateTime;
    excused: boolean;
    late_policy_status?: any;
    points_deducted?: any;
    grading_period_id?: any;
    extra_attempts?: any;
    posted_at: DateTime;
    late: boolean;
    missing: boolean;
    seconds_late: number;
    entered_grade: string;
    entered_score: number;
    preview_url: string;
    attachments?: Canvas_Attachment[];
    assignment?: Canvas_Assignment;

    constructor(data: any) {
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
        if(data.attachments)
            this.attachments = data.attachments.map((attachment: any) => new Canvas_Attachment(attachment));
        if(data.assignment)
            this.assignment = new Canvas_Assignment(data.assignment);
    }
}

export class Canvas_Calendar {
    ics: string;

    constructor(data: any) {
        this.ics = data.ics;
    }
}

export class Canvas_Enrollment {
    type: string;
    role: string;
    role_id: number;
    user_id: number;
    enrollment_state: string;
    limit_privileges_to_course_section: boolean;

    constructor(data: any) {
        this.type = data.type;
        this.role = data.role;
        this.role_id = data.role_id;
        this.user_id = data.user_id;
        this.enrollment_state = data.enrollment_state;
        this.limit_privileges_to_course_section = data.limit_privileges_to_course_section;
    }
}

export class Canvas_Course {
    id: number;
    name: string;
    account_id: number;
    uuid: string;
    start_at: DateTime;
    grading_standard_id?: number;
    is_public: boolean;
    created_at: DateTime;
    course_code: string;
    default_view: string;
    root_account_id: number;
    enrollment_term_id: number;
    license: string;
    grade_passback_setting?: any;
    end_at?: DateTime;
    public_syllabus: boolean;
    public_syllabus_to_auth: boolean;
    storage_quota_mb: number;
    is_public_to_auth_users: boolean;
    apply_assignment_group_weights: boolean;
    calendar?: Canvas_Calendar;
    time_zone: string;
    blueprint: boolean;
    enrollments?: Canvas_Enrollment[];
    hide_final_grades: boolean;
    workflow_state: string;
    course_format: string;
    restrict_enrollments_to_course_dates: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.account_id = data.account_id;
        this.uuid = data.uuid;
        this.start_at = DateTime.fromISO(data.start_at);
        this.grading_standard_id = data.grading_standard_id;
        this.is_public = data.is_public;
        this.created_at = DateTime.fromISO(data.created_at);
        this.course_code = data.course_code;
        this.default_view = data.default_view;
        this.root_account_id = data.root_account_id;
        this.enrollment_term_id = data.enrollment_term_id;
        this.license = data.license;
        this.grade_passback_setting = data.grade_passback_setting;
        this.end_at = DateTime.fromISO(data.end_at);
        this.public_syllabus = data.public_syllabus;
        this.public_syllabus_to_auth = data.public_syllabus_to_auth;
        this.storage_quota_mb = data.storage_quota_mb;
        this.is_public_to_auth_users = data.is_public_to_auth_users;
        this.apply_assignment_group_weights = data.apply_assignment_group_weights;
        if(data.calendar)
            this.calendar = data.calendar;
        this.time_zone = data.time_zone;
        this.blueprint = data.blueprint;
        if(data.enrollments)
            this.enrollments = data.enrollments;
        this.hide_final_grades = data.hide_final_grades;
        this.workflow_state = data.workflow_state;
        this.course_format = data.course_format;
        this.restrict_enrollments_to_course_dates = data.restrict_enrollments_to_course_dates;
    }
}