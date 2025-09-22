// const questions = [
//     {
//         id: "vector_q1",
//         text: "What is the magnitude of the vector shown in the diagram below?",
//         image: "https://ibb.co.com/chvKdH72",
//         options: {
//             a: "5 units",
//             b: "7 units", 
//             c: "25 units",
//             d: "12 units"
//         },
//         correct: "a",
//         topic: "Vector Magnitude",
//         video: "https://www.youtube.com/watch?v=ml4NSzCQobk"
//     },
//     {
//         id: "vector_q2",
//         text: "Based on the diagram, calculate the dot product of vectors A and B:",
//         // image: "https://i.imgur.com/your-image-id-2.png", // Replace with your actual image URL
//         options: {
//             a: "10",
//             b: "11",
//             c: "14", 
//             d: "8"
//         },
//         correct: "b",
//         topic: "Dot Product",
//         video: "https://www.youtube.com/watch?v=WNuIhXo39_k"
//     },
//     // Add more questions with images as needed
// ];


// const questions = [
//     {
//         id: "vector1",
//         topic: "a",
//         text: "Given vectors $\\vec{A} = \\langle 3, 4, 0 \\rangle$ and $\\vec{B} = \\langle 1, -2, 5 \\rangle$, find $\\vec{A} + \\vec{B}$:",
//         options: {
//             "a": "$\\langle 4, 2, 5 \\rangle$",
//             "b": "$\\langle 2, 6, -5 \\rangle$",
//             "c": "$\\langle 3, -8, 0 \\rangle$",
//             "d": "$\\langle 4, 2, -5 \\rangle$"
//         },
//         correct: "a",
//         video: "https://www.youtube.com/watch?v=vector-addition"
//     },
//     {
//         id: "vector2",
//         topic: "a",
//         text: "Calculate the dot product $\\vec{A} \\cdot \\vec{B}$ where $\\vec{A} = \\langle 2, -1, 3 \\rangle$ and $\\vec{B} = \\langle 4, 5, -1 \\rangle$:",
//         options: {
//             "a": "0",
//             "b": "-2",
//             "c": "10",
//             "d": "16"
//         },
//         correct: "a",
//         video: "https://www.youtube.com/watch?v=dot-product"
//     },
//     {
//         id: "vector3",
//         topic: "a",
//         text: "Find the magnitude of vector $\\vec{V} = \\langle 3, 4, 12 \\rangle$ using the formula $|\\vec{V}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$:",
//         options: {
//             "a": "13",
//             "b": "19", 
//             "c": "5",
//             "d": "$\\sqrt{169}$"
//         },
//         correct: "a",
//         video: "https://www.youtube.com/watch?v=vector-magnitude"
//     },
//     {
//         id: "vector4", 
//         topic: "a",
//         text: "Find $\\vec{i} \\times \\vec{j}$ where $\\vec{i} = \\langle 1, 0, 0 \\rangle$ and $\\vec{j} = \\langle 0, 1, 0 \\rangle$:",
//         options: {
//             "a": "$\\vec{k} = \\langle 0, 0, 1 \\rangle$",
//             "b": "$-\\vec{k} = \\langle 0, 0, -1 \\rangle$",
//             "c": "$\\langle 1, 1, 0 \\rangle$",
//             "d": "$\\langle 0, 0, 0 \\rangle$"
//         },
//         correct: "a",
//         video: "https://www.youtube.com/watch?v=cross-product"
//     },
//     {
//         id: "vector5",
//         topic: "a", 
//         text: "Find the unit vector $\\hat{u}$ in the direction of $\\vec{V} = \\langle 6, -8, 0 \\rangle$ using $\\hat{u} = \\frac{\\vec{V}}{|\\vec{V}|}$:",
//         options: {
//             "a": "$\\langle 0.6, -0.8, 0 \\rangle$",
//             "b": "$\\langle 3, -4, 0 \\rangle$", 
//             "c": "$\\langle 6, -8, 1 \\rangle$",
//             "d": "$\\langle 0.8, 0.6, 0 \\rangle$"
//         },
//         correct: "a",
//         video: "https://www.youtube.com/watch?v=unit-vectors"
//     }
// ];

const questions = [
    {
        id: "vector_q1",
        text: "What is the magnitude of vector $\\vec{A}$ shown in the coordinate plane?",
        image: "https://i.ibb.co.com/Gf5GLyPf/image.jpg", // Replace with actual URL
        options: {
            a: "5 units",
            b: "7 units", 
            c: "25 units",
            d: "12 units"
        },
        correct: "a",
        topic: "Vector Magnitude",
        video: "https://www.youtube.com/watch?v=ml4NSzCQobk"
    },
    {
        id: "vector_q2",
        text: "Based on the diagram, calculate the dot product $\\vec{A} \\cdot \\vec{B}$:",
        image: "https://i.ibb.co/your-code/dot-product-diagram.png",
        options: {
            a: "10",
            b: "11",
            c: "14", 
            d: "8"
        },
        correct: "b",
        topic: "Dot Product",
        video: "https://www.youtube.com/watch?v=WNuIhXo39_k"
    },
    {
        id: "vector_q3",
        text: "Find the cross product $\\vec{A} \\times \\vec{B}$ using the right-hand rule:",
        image: "https://i.ibb.co/your-code/cross-product-3d.png",
        options: {
            a: "$\\langle 0, 0, 1 \\rangle$",
            b: "$\\langle 1, 0, 0 \\rangle$",
            c: "$\\langle 0, 1, 0 \\rangle$",
            d: "$\\langle -1, 0, 0 \\rangle$"
        },
        correct: "a",
        topic: "Cross Product",
        video: "https://www.youtube.com/watch?v=cross-product"
    },
    {
        id: "vector_q4",
        text: "What is the unit vector in the direction of $\\vec{V}$ shown below?",
        image: "https://i.ibb.co/your-code/unit-vector-diagram.png",
        options: {
            a: "$\\langle 0.6, 0.8 \\rangle$",
            b: "$\\langle 0.8, 0.6 \\rangle$",
            c: "$\\langle 3, 4 \\rangle$",
            d: "$\\langle 4, 3 \\rangle$"
        },
        correct: "a",
        topic: "Unit Vectors",
        video: "https://www.youtube.com/watch?v=unit-vectors"
    },
    {
        id: "vector_q5",
        text: "Given vectors $\\vec{A} = \\langle 3, 4, 0 \\rangle$ and $\\vec{B} = \\langle 1, -2, 5 \\rangle$, find $\\vec{A} + \\vec{B}$:",
        // No image for this question - pure calculation
        options: {
            a: "$\\langle 4, 2, 5 \\rangle$",
            b: "$\\langle 2, 6, -5 \\rangle$",
            c: "$\\langle 3, -8, 0 \\rangle$",
            d: "$\\langle 4, 2, -5 \\rangle$"
        },
        correct: "a",
        topic: "Vector Addition",
        video: "https://www.youtube.com/watch?v=vector-addition"
    }
];