const aets: NiicAet[] = [
    {
        type: "appointment",
        id: nextGlobalId(),
        title: "Do something",
        description: "",
        startTime: 15,
        endTime: 20,
        date: new Date(Date.now()),
        color: "#abc",
    },
    {
        type: "appointment",
        id: nextGlobalId(),
        title: "Do something else",
        description: "",
        startTime: 20,
        endTime: 21,
        date: new Date(Date.parse("2024-03-06")),
        color: "#bca",
    },
    {
        type: "appointment",
        id: nextGlobalId(),
        title: "An appointment with a long name.",
        description: "",
        startTime: 2,
        endTime: 9,
        date: new Date(Date.parse("2024-03-07")),
        color: "#f00",
    },

    {
        type: "event",
        id: nextGlobalId(),
        title: "An event with a very very long name.",
        description: "",
        startTime: 5,
        endTime: 14,
        date: new Date(Date.parse("2024-03-09")),
        color: "#aaa",
    },

    {
        type: "task",
        id: nextGlobalId(),
        title: "Hi",
        description: "",
        startTime: 3,
        endTime: 10,
        date: new Date(Date.now()),
        color: "#aed",
    },
    {
        type: "task",
        id: nextGlobalId(),
        title: "Hi",
        description: "",
        startTime: 3,
        endTime: 10,
        date: new Date(Date.parse("2024-03-08")),
        color: "#a77",
    },
];
