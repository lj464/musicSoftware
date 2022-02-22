export default function (arr,value) {
    let node = []
    arr.forEach((v) => {
        let sonNode = []
        if (v.toUpperCase().startsWith(value.toUpperCase())) {
            let node1 = {
                name: 'span',
                attrs: {
                    style: 'line-height: 30px; color: red;'
                },
                children: [{
                    type: 'text',
                    text: v.slice(0, value.length)
                }]
            }
            let node2 = {
                name: 'span',
                children: [{
                    type: 'text',
                    text: v.slice(value.length, v.length)
                }]
            }
            sonNode.push(node1)
            sonNode.push(node2)
        } else {
            let node1 = {
                name: 'span',
                attrs: {
                },
                children: [{
                    type: 'text',
                    text: v
                }]
            }
            sonNode.push(node1)
        }
        node.push(sonNode)
    })
    return node
}