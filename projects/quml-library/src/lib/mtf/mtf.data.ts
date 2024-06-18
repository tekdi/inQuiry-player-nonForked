export const mtfQuestionMetadata = {
    "mimeType": "application/vnd.sunbird.question",
    "media": [],
    "editorState": {
        "options": {
            "left": [
                {
                    "value": {
                        "body": "<p>Red</p>",
                        "value": 0
                    }
                },
                {
                    "value": {
                        "body": "<p>Green</p>",
                        "value": 1
                    }
                },
                {
                    "value": {
                        "body": "<p>Yellow</p>",
                        "value": 2
                    }
                },
                {
                    "value": {
                        "body": "<p>Orange</p>",
                        "value": 3
                    }
                }
            ],
            "right": [
                {
                    "value": {
                        "body": "<p>Apple</p>",
                        "value": 0
                    }
                },
                {
                    "value": {
                        "body": "<p>Grapes</p>",
                        "value": 1
                    }
                },
                {
                    "value": {
                        "body": "<p>Banana</p>",
                        "value": 2
                    }
                },
                {
                    "value": {
                        "body": "<p>Orange</p>",
                        "value": 3
                    }
                }
            ]
        },
        "question": "<p>Match the following colour with the fruits</p>"
    },
    "templateId": "mtf-horizontal",
    "complexityLevel": [],
    "maxScore": 1,
    "name": "MTF Colour",
    "responseDeclaration": {
        "response1": {
            "cardinality": "ordered",
            "type": "map",
            "correctResponse": {
                "value": [
                    {
                        "lhs": 0,
                        "rhs": 0
                    },
                    {
                        "lhs": 1,
                        "rhs": 1
                    },
                    {
                        "lhs": 2,
                        "rhs": 2
                    },
                    {
                        "lhs": 3,
                        "rhs": 3
                    }
                ]
            },
            "mapping": [
                {
                    "value": {
                        "lhs": 0,
                        "rhs": 0
                    },
                    "score": 0.25
                },
                {
                    "value": {
                        "lhs": 1,
                        "rhs": 1
                    },
                    "score": 0.25
                },
                {
                    "value": {
                        "lhs": 2,
                        "rhs": 2
                    },
                    "score": 0.25
                },
                {
                    "value": {
                        "lhs": 3,
                        "rhs": 3
                    },
                    "score": 0.25
                }
            ]
        }
    },
    "outcomeDeclaration": {
        "maxScore": {
            "cardinality": "multiple",
            "type": "integer",
            "defaultValue": 1
        },
        "hint": {
            "cardinality": "single",
            "type": "string",
            "defaultValue": "ab02bf0b-e47d-49b4-aedd-d299a28e89e2"
        }
    },
    "interactionTypes": [
        "match"
    ],
    "interactions": {
        "response1": {
            "type": "match",
            "options": {
                "left": [
                    {
                        "label": "<p>Red</p>",
                        "value": 0
                    },
                    {
                        "label": "<p>Green</p>",
                        "value": 1
                    },
                    {
                        "label": "<p>Yellow</p>",
                        "value": 2
                    },
                    {
                        "label": "<p>Orange</p>",
                        "value": 3
                    }
                ],
                "right": [
                    {
                        "label": "<p>Apple</p>",
                        "value": 0
                    },
                    {
                        "label": "<p>Grapes</p>",
                        "value": 1
                    },
                    {
                        "label": "<p>Banana</p>",
                        "value": 2
                    },
                    {
                        "label": "<p>Orange</p>",
                        "value": 3
                    }
                ]
            },
            "validation": {
                "required": "Yes"
            }
        }
    },
    "qType": "MTF",
    "primaryCategory": "Match The Following Question",
    "body": "<div class='question-body' tabindex='-1'><div class='mtf-title' tabindex='0'><p>Match the following colour with the fruits</p></div><div data-match-interaction='response1' class='mtf-horizontal'></div></div>",
    "answer": "<div class='match-container'><div class='left-options'><div class='left-option'><p>Red</p></div><div class='left-option'><p>Green</p></div><div class='left-option'><p>Yellow</p></div><div class='left-option'><p>Orange</p></div></div><div class='right-options'><div class='right-option'><p>Apple</p></div><div class='right-option'><p>Grapes</p></div><div class='right-option'><p>Banana</p></div><div class='right-option'><p>Orange</p></div></div></div>",
    "solutions": {},
    "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
    "board": "State(Tamil Nadu)",
    "medium": [
        "English"
    ],
    "gradeLevel": [
        "Class 1"
    ],
    "subject": [
        "Accountancy"
    ],
    "author": "contentCreator",
    "channel": "0137541424673095687",
    "framework": "tn_k-12",
    "copyright": "sunbird",
    "audience": [
        "Student"
    ],
    "license": "CC BY 4.0"
}