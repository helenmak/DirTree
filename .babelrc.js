module.exports = {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "plugins": [
        "react-hot-loader/babel",
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        ["@babel/plugin-transform-modules-commonjs", {
            "allowTopLevelThis": true
        }],
        "@babel/plugin-syntax-dynamic-import"
    ]
}
