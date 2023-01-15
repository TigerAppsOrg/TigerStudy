# -----------------------------------------------------------------------
# emails.py
# Author: Caroline di Vittorio
# -----------------------------------------------------------------------
from database import *
from sendgrid.helpers.mail import Mail, Content

TIGERSTUDY_EMAIL = os.environ.get("MAIL_USERNAME")

# sends email to welcome new student to a new group when they are the first
# student in that group
def newGroupWelcomeEmail(netid, groupid):
    subject, body = fetchEmailTemplate("New Group Welcome Email")

    student_info = getStudentInformation(netid)
    first_name = (
        netid if student_info.getFirstName() == "" else student_info.getFirstName()
    )
    course_name = getCourseName(groupid)

    subject = subject.replace("$COURSE$", course_name)
    body = body.replace("$RECIPIENT$", str(first_name)).replace("$COURSE$", course_name)
    content = Content("text/plain", body)

    msg = Mail(
        subject=subject,
        from_email=TIGERSTUDY_EMAIL,
        to_emails=[netid + "@princeton.edu"],
        html_content=content,
    )

    return msg


def courseDeniedEmail(netids, dept, num):
    subject, body = fetchEmailTemplate("Course Denied Email")

    emails = []
    for netid in netids:
        emails.append(str(netid) + "@princeton.edu")

    subject = subject.replace("$COURSE$", str(dept) + str(num))
    content = Content("text/plain", body)

    msg = Mail(
        subject=subject,
        html_content=content,
        from_email=TIGERSTUDY_EMAIL,
        to_emails=emails,
    )

    return msg


def courseApprovedEmail(groups, dept, num):
    subject, body = fetchEmailTemplate("Course Approved Email")

    msgs = []
    for students in groups:
        contact_summary = ""
        email = []
        for std in students:
            s = getStudentInformation(std)
            email.append(s.getNetid() + "@princeton.edu")
            if s.getFirstName() != "":
                contact_summary += (
                    str(s.getFirstName()) + " " + str(s.getLastName()) + ": "
                )
            contact_summary += str(s.getNetid()) + "@princeton.edu\n"

        body = body.replace("$COURSE$", str(dept) + str(num)).replace(
                "$CONTACT_INFO$", contact_summary)
        content = Content("text/plain", body)

        msg = Mail(
            subject=subject.replace("$COURSE$", str(dept) + str(num)),
            html_content=content,
            from_email=TIGERSTUDY_EMAIL,
            to_emails=email,
        )

        msgs.append(msg)

    return msgs


# -----------------------------------------------------------------------
# sends email welcome a new student to an already existing study group
def newStudentWelcomeEmail(netid, students, groupid):
    subject, body = fetchEmailTemplate("New Student Welcome Email")

    student_info = getStudentInformation(netid)
    if student_info.getFirstName() == "":
        student_name = student_info.getNetid()
    else:
        student_name = (
            str(student_info.getFirstName()) + " " + str(student_info.getLastName())
        )
    course_name = getCourseName(groupid)

    email = [netid + "@princeton.edu"]
    contact_summary = ""
    for std in students:
        s = getStudentInformation(std)
        email.append(s.getNetid() + "@princeton.edu")
        if s.getFirstName() != "":
            contact_summary += str(s.getFirstName()) + " " + str(s.getLastName()) + ": "
        contact_summary += str(s.getNetid()) + "@princeton.edu\n"

    if student_info.getFirstName() == "":
        name_msg = "A new student"
    else:
        name_msg = student_name

    subject = subject.replace("$COURSE$", course_name).replace("$JOINEE$", name_msg)
    body = (
        body.replace("$COURSE$", course_name)
        .replace("$JOINEE$", student_name)
        .replace("$CONTACT_INFO$", contact_summary)
    )
    content = Content("text/plain", body)

    msg = Mail(
        subject=subject,
        html_content=content,
        from_email=TIGERSTUDY_EMAIL,
        to_emails=email,
    )

    return msg


# -----------------------------------------------------------------------
# sends welcome email for first login of new student
def welcomeEmail(netid):
    subject, body = fetchEmailTemplate("First Login Welcome Email")

    email = [str(netid) + "@princeton.edu"]
    content = Content("text/plain", body)
    msg = Mail(subject=subject, html_content=content, from_email=TIGERSTUDY_EMAIL, to_emails=email)

    return msg


def waitingApprovalEmail(dept, num, netid):
    subject, body = fetchEmailTemplate("Waiting Approval Email")

    subject = subject.replace("$COURSE$", str(dept) + str(num))

    email = [str(netid) + "@princeton.edu"]
    content = Content("text/plain", body)
    msg = Mail(
        subject=subject,
        html_content=content,
        from_email=TIGERSTUDY_EMAIL,
        to_emails=email,
    )

    email_admins = getEmailListAdmins()
    content = Content("text/plain", (
        str(netid)
        + " has requested to join "
        + str(dept)
        + str(num)
        + " on TigerStudy."
    ))
    msg_admins = Mail(
        subject="Someone has requested to join TigerStudy for " + str(dept) + str(num),
        html_content=content,
        from_email=TIGERSTUDY_EMAIL,
        to_emails=email_admins,
    )

    return [msg, msg_admins]


def fetchEmailTemplate(type_):
    conn = db.connect()
    stmt = emails.select().where(emails.c.type == type_)
    result = conn.execute(stmt)
    conn.close()
    template = list(result)[0]
    _, subject, body = template
    return subject, body


def getCourseName(groupid):
    group_information = getGroupInformation(groupid)
    return group_information.getClassDept() + group_information.getClassNum()


if __name__ == "__main__":
    # print(fetchEmailTemplate("Waiting Approval Email"))
    # print(newGroupWelcomeEmail("tl5559", 581))
    # print(courseDeniedEmail([], "ECO", 100))
    # print(courseApprovedEmail([["ntyp"]], "ECO", 100))
    # print(newStudentWelcomeEmail("tl5559", ["tl5559", "ntyp"], 581))
    # print(welcomeEmail("ntyp"))

    # sg = SendGridAPIClient(SENDGRID_API_KEY)
    # message = newGroupWelcomeEmail("sheh", 804)
    # sg.send(message)

    # message = courseDeniedEmail(["sheh"], "COS", 302)
    # sg.send(message)

    # messages = courseApprovedEmail([["sheh"], ["sheh"]], "COS", 302)
    # for msg in messages:
    #     sg.send(msg)

    # message = newStudentWelcomeEmail("sheh", ["ntyp", "sheh"], 804)
    # sg.send(message)

    # message = welcomeEmail("sheh")
    # sg.send(message)

    # messages = waitingApprovalEmail("COS", 302, "sheh")
    # sg.send(messages[0])
    # sg.send(messages[1])
    pass