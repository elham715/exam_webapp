const questions = [
    {
        id: "friction_q1",
        text: "চিত্র হতে, একটি ভর $m = 2\\,\\text{kg}$ কে ঢালু তলে রাখা হয়েছে যেখানে $\\theta = 60^\\circ$, $\\mu = \\tfrac{\\sqrt{3}}{2}$. যদি ভারসাম্যের শর্ত হয়, তাহলে প্রয়োজনীয় $F$ বলের মান নির্ণয় করুন:",
        image: "https://i.ibb.co.com/your-image-code/incline-diagram.png", // replace with your diagram URL
        options: {
            a: "$2.9\\,\\text{N}$",
            b: "$4.9\\,\\text{N}$",
            c: "$6.9\\,\\text{N}$",
            d: "$9.8\\,\\text{N}$"
        },
        correct: "b",
        topic: "Friction on Inclined Plane",
        solution: `
            \```math

            mg \\sin\\theta + F = \\mu R
            \```
            \```math

            R = mg \\cos\\theta \\implies mg \\sin\\theta + F = \\mu mg \\cos\\theta
            \```
            \```math

            F = \\mu mg \\cos\\theta - mg \\sin\\theta
            \```
            \```math

            = \\frac{\\sqrt{3}}{2} \\times 2 \\times 9.8 \\times \\tfrac{1}{2} 
               - 2 \\times 9.8 \\times \\tfrac{\\sqrt{3}}{2}
            \```
            \```math

            = 1.5 \\times 9.8 - 9.8 = 0.5 \\times 9.8
            \```
            \```math

            \\boxed{F = 4.9\\,\\text{N}}
            \```
        `,
        video: "https://www.youtube.com/watch?v=friction-incline-demo"
    }
];
