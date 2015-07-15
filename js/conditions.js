var conditions = [
    // three horizontal and one vertical image:
    // one six col image, two stacked in three, one in three by itself
    {
        want: {
            h: 3,
            v: 1
        },
        layout: [
            {
                type: 'h',
                cols: 6
            },
            {
                type: 'h',
                cols: 3
            },
            {
                type: 'h',
                cols: 0
            },
            {
                type: 'v',
                cols: 3
            }]
    },
    // four horizontal:
    // just put 'em in three columns each
    {
        want: {
            h: 4,
            v: 0
        },
        layout: [
            { cols: 3 },
            { cols: 3 },
            { cols: 3 },
            { cols: 3 }
        ]
    },
    // four vertical: same as above
    {
        want: {
            h: 0,
            v: 4
        },
        layout: [
            { cols: 3 },
            { cols: 3 },
            { cols: 3 },
            { cols: 3 }
        ]
    },
    // two and two:
    // two stacked in six, one in three, one in three
    {
        want: {
            h: 2,
            v: 2
        },
        layout: [
            {
                type: 'h',
                cols: 5
            },
            {
                type: 'h',
                cols: 0
            },
            {
                type: 'v',
                cols: 4
            },
            {
                type: 'v',
                cols: 3
            }
        ]
    },
    // three vertical, one horizontal:
    // all side by side but staggered a little
    {
        want: {
            h: 1,
            v: 3
        },
        layout: [
            {
                type: 'v',
                cols: 2
            },
            {
                type: 'h',
                cols: 5
            },
            {
                type: 'v',
                cols: 2
            },
            {
                type: 'v',
                cols: 3
            }
        ]
    },
    // OK, moving on to three image layouts.
    // first up: three horizontal
    {
        want: {
            h: 3,
            v: 0
        },
        layout: [
            { cols: 4 },
            { cols: 4 },
            { cols: 4 }
        ]
    },
    // three vertical
    {
        want: {
            h: 0,
            v: 3
        },
        layout: [
            { cols: 4 },
            { cols: 4 },
            { cols: 4 }
        ]
    },
    // two horizontal, one vertical
    {
        want: {
            h: 2,
            v: 1
        },
        layout: [
            {
                type: 'h',
                cols: 5
            },
            {
                type: 'h',
                cols: 5
            },
            {
                type: 'v',
                cols: 2
            }
        ]
    },
    // one horizontal, two vertical
    {
        want: {
            h: 1,
            v: 2
        },
        layout: [
            {
                type: 'v',
                cols: 3
            },
            {
                type: 'v',
                cols: 3
            },
            {
                type: 'h',
                cols: 6
            }
        ]
    },
    // moving on to two image layouts.
    // two horizontal:
    {
        want: {
            h: 2,
            v: 0
        },
        layout: [
            { cols: 4 },
            { cols: 4 }
        ]
    },
    // two vertical
    {
        want: {
            h: 0,
            v: 2
        },
        layout: [
            { cols: 4 },
            { cols: 4 }
        ]
    },
    // one horizontal and one vertical
    {
        want: {
            h: 1,
            v: 1
        },
        layout: [
            {
                type: 'h',
                cols: 6
            },
            {
                type: 'v',
                cols: 3
            }
        ]
    },
    // and the ones... just leave 'em dangling
    {
        want: {
            h: 1,
            v: 0
        },
        layout: [
            { cols: 6 }
        ]
    },
    {
        want: {
            h: 0,
            v: 1
        },
        layout: [
            { cols: 4}
        ]
    }
];
