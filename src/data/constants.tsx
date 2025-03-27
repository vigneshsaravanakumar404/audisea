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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        title: "ACT Prep",
        buttonText: getClosestDate(actTestDates),
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        title: "AP Exam Prep",
        buttonText: getClosestDate(apTestDates),
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    }
];

export const subjectOptions = [
    {
        label: "Test Prep",
        options: [
            { value: "SAT Prep", label: "SAT" },
            { value: "ACT Prep", label: "ACT" }
        ]
    },
    {
        label: "AP Sciences",
        options: [
            { value: "ap_biology", label: "AP Biology" },
            { value: "ap_chemistry", label: "AP Chemistry" },
            { value: "ap_environmental_science", label: "AP Environmental Science" },
            { value: "ap_physics_1", label: "AP Physics 1: Algebra-Based" },
            { value: "ap_physics_2", label: "AP Physics 2: Algebra-Based" },
            { value: "ap_physics_c_electricity", label: "AP Physics C: Electricity and Magnetism" },
            { value: "ap_physics_c_mechanics", label: "AP Physics C: Mechanics" }
        ]
    },
    {
        label: "AP Math & Computer Sciences",
        options: [
            { value: "ap_calculus_AB", label: "AP Calculus AB" },
            { value: "ap_calculus_BC", label: "AP Calculus BC" },
            { value: "ap_computer_science_a", label: "AP Computer Science A" },
            { value: "ap_computer_science_principles", label: "AP Computer Science Principles" },
            { value: "ap_precalculus", label: "AP Precalculus" },
            { value: "ap_statistics", label: "AP Statistics" },
        ]
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
