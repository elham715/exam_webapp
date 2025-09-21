const questions = [
    {
        id: "vector_1_q1",
        text: "Given vectors $\\vec{A} = 3\\hat{i} + \\hat{j} - 2\\hat{k}$ and $\\vec{B} = \\hat{i} + 3\\hat{j} - 2\\hat{k}$, find the magnitude $|\\overrightarrow{AB}|$.<br><br>Use: $\\overrightarrow{AB} = \\vec{B} - \\vec{A}$ and $|\\vec{v}| = \\sqrt{x^2 + y^2 + z^2}$",
        options: {
            a: "$2\\sqrt{6}$",
            b: "$2\\sqrt{2}$",
            c: "$\\sqrt{6}$",
            d: "$\\sqrt{2}$"
        },
        correct: "b",
        topic: "Vector Distance",
        video: "https://www.youtube.com/watch?v=V5IkvYjryzQ"
    },
    {
        id: "vector_1_q2",
        text: "What is the magnitude of vector $\\vec{V} = 6\\hat{i} + 8\\hat{j} - 5\\hat{k}$ in the XY plane?<br><br>In XY plane: $|\\vec{V}_{XY}| = \\sqrt{V_x^2 + V_y^2}$ (ignore $\\hat{k}$ component)",
        options: {
            a: "$6$ units",
            b: "$10$ units",
            c: "$0$ units",
            d: "$5\\sqrt{5}$ units"
        },
        correct: "b",
        topic: "Vector Projection",
        video: "https://www.youtube.com/watch?v=V5IkvYjryzQ"
    },
    {
        id: "vector_1_q3",
        text: "Calculate the dot product $\\vec{P} \\cdot \\vec{Q}$ where $\\vec{P} = 4\\hat{i} - 3\\hat{j} + \\hat{k}$ and $\\vec{Q} = 2\\hat{i} + \\hat{j} - 3\\hat{k}$.<br><br>Formula: $\\vec{P} \\cdot \\vec{Q} = P_x Q_x + P_y Q_y + P_z Q_z$",
        options: {
            a: "$2$",
            b: "$8$",
            c: "$5$",
            d: "$-2$"
        },
        correct: "a",
        topic: "Dot Product",
        video: "https://www.youtube.com/watch?v=LyGKycYT2v0"
    },
    {
        id: "vector_1_q4",
        text: "Find the cross product $\\vec{A} \\times \\vec{B}$ where $\\vec{A} = 2\\hat{i} + \\hat{j} - \\hat{k}$ and $\\vec{B} = \\hat{i} - \\hat{j} + 2\\hat{k}$.<br><br>Use determinant: $\\vec{A} \\times \\vec{B} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ 2 & 1 & -1 \\\\ 1 & -1 & 2 \\end{vmatrix}$",
        options: {
            a: "$\\hat{i} - 5\\hat{j} - 3\\hat{k}$",
            b: "$\\hat{i} + 5\\hat{j} - 3\\hat{k}$",
            c: "$\\hat{i} - 5\\hat{j} + 3\\hat{k}$",
            d: "$-\\hat{i} + 5\\hat{j} + 3\\hat{k}$"
        },
        correct: "a",
        topic: "Cross Product",
        video: "https://www.youtube.com/watch?v=eu6i7WJeinw"
    },
    {
        id: "vector_1_q5",
        text: "Two forces $\\vec{F_1} = 3\\hat{i} + 4\\hat{j}$ N and $\\vec{F_2} = 5\\hat{i} - 12\\hat{j}$ N act on a particle. Find the magnitude of the resultant $\\vec{R} = \\vec{F_1} + \\vec{F_2}$.<br><br>Use: $|\\vec{R}| = \\sqrt{R_x^2 + R_y^2}$ where $\\vec{R} = (F_{1x} + F_{2x})\\hat{i} + (F_{1y} + F_{2y})\\hat{j}$",
        options: {
            a: "$8\\sqrt{2}$ N",
            b: "$16$ N",
            c: "$8$ N",
            d: "$4\\sqrt{2}$ N"
        },
        correct: "a",
        topic: "Vector Addition",
        video: "https://www.youtube.com/watch?v=fNk_zzaMoSs"
    }
];