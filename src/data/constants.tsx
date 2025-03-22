const getClosestDate = (dates: string[]): string => {
    const now = new Date();
    const futureDates = dates
        .map(date => new Date(date))
        .filter(date => date > now)
        .sort((a, b) => a.getTime() - b.getTime());

    if (futureDates.length > 0) {
        const closestDate = futureDates[0];
        const options: Intl.DateTimeFormatOptions = closestDate.getDate() === 1
            ? { year: 'numeric', month: 'long' }
            : { year: 'numeric', month: 'long', day: 'numeric' };
        return closestDate.toLocaleDateString(undefined, options);
    }

    return "Learn More!";
};

const satTestDates = [
    "May 3, 2025",
    "June 7, 2025",
    "August 23, 2025",
    "September 13, 2025",
    "October 4, 2025",
    "November 8, 2025",
    "December 6, 2025",
    "Spring 2026",
    "March 14, 2026",
    "May 2, 2026",
    "June 6, 2026",
];

const actTestDates = [
    "June 7, 2025",
    "July 12, 2025",
    "September 13, 2025",
    "October 25, 2025",
    "December 13, 2025",
    "February 7, 2026",
    "April 18, 2026",
    "June 13, 2026",
];

const apTestDates = [
    "May, 2025",
    "May, 2026",
    "May, 2027",
    "May, 2028",
    "May, 2029",
    "May, 2030",
    "May, 2031",
];

export const offerings = [
    {
        title: "SAT Prep",
        buttonText: getClosestDate(satTestDates),
        description: "Prepare for the SAT with our expert tutors. We offer personalized study plans and practice tests to help you ace the exam.",
    },
    {
        title: "ACT Prep",
        buttonText: getClosestDate(actTestDates),
        description: "Get ready for the ACT with our experienced tutors. We provide comprehensive study materials and practice tests to help you succeed.",
    },
    {
        title: "AP Exam Prep",
        buttonText: getClosestDate(apTestDates),
        description: "Prepare for your AP exams with our knowledgeable tutors. We offer study resources and practice tests to help you get a 5.",
    }
];

export const testimonials = [
    {
        quote: "I really love this tutoring place. The tutors are extraordinary and explain the concepts perfectly.",
        name: "Bob R.",
        role: "Parent",
    },
    {
        quote: "This platform has been a game-changer for my child’s education. Highly recommend!",
        name: "Sarah M.",
        role: "Parent",
    },
    {
        quote: "The best tutoring experience! The tutors are knowledgeable and patient.",
        name: "Jake P.",
        role: "Student",
    },
    {
        quote: "Helped me improve my grades tremendously. I feel much more confident now.",
        name: "Emily W.",
        role: "Student",
    },
    {
        quote: "The tutors here are amazing! They helped me understand concepts I struggled with for years.",
        name: "Alice T.",
        role: "Student",
    },
    {
        quote: "Audisea has been a blessing for my family. My child’s confidence has skyrocketed!",
        name: "Michael L.",
        role: "Parent",
    },
    {
        quote: "I’ve never seen such dedicated and passionate tutors. Highly recommend this platform!",
        name: "Sophia K.",
        role: "Parent",
    },
    {
        quote: "Thanks to Audisea, I aced my exams and got into my dream college!",
        name: "Chris P.",
        role: "Student",
    },
];
