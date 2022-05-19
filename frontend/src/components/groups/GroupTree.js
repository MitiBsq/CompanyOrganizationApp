import React, { useRef, useEffect } from 'react';
import { select, hierarchy, tree, linkHorizontal } from 'd3';

export default function GroupTree(props) {
    //Starting the variables tree style
    const data = {
        name: props.groupId.split('-')[0],
        children: []
    }

    const nodes = {
        [props.groupId.split('-')[1]]: []
    }

    //Create the nodes for the tree
    props.childGroups.forEach(group => {
        if (group.parent === undefined) {
            nodes[props.groupId.split('-')[1]].push(group);
            data.children.push({
                id: group.group_id,
                name: group.name,
                children: []
            });
        } else {
            if (nodes[group.parent] === undefined) {
                nodes[group.parent] = [];
                const filter = props.childGroups.filter(item => item.parent === group.parent);
                nodes[group.parent] = filter;
            }
        }
    });
    //Chain the nodes
    const nodeKeys = Object.keys(nodes);
    nodeKeys.forEach(key => {
        if (nodes[key]) {
            for (let i = 0; i < nodes[key].length; ++i) {
                if (nodes[nodes[key][i].group_id] !== undefined) {
                    nodes[key][i]['children'] = nodes[nodes[key][i].group_id];
                }
            }
        }
    });

    //Inserting the chained nodes in the main variable used for the tree
    data.children = nodes[props.groupId.split('-')[1]];

    //For using the existent svg element
    const svgRef = useRef();

    useEffect(() => {
        const svg = select(svgRef.current);
        //Function from the d3 library that transform our data in a tree style data 
        const root = hierarchy(data);
        //The size of the svg/tree
        const treeLayout = tree().size([500, 500]);

        //For generating the links(lines) between the nodes
        const linkGenerator = linkHorizontal()
            .x(link => link.y)
            .y(link => link.x);

        treeLayout(root);

        //Creating the nodes (black points)
        svg
            .selectAll(".node")
            .data(root.descendants())
            .join("circle")
            .attr("class", "node")
            .attr("r", 4)
            .attr("fill", "black")
            .attr("cx", node => node.y)
            .attr("cy", node => node.x);

        //Creating the links
        svg
            .selectAll(".links")
            .data(root.links())
            .join("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr('stroke', 'black')
            .attr("d", linkGenerator);

        //Label the nodes by the group name
        svg
            .selectAll(".label")
            .data(root.descendants())
            .join("text")
            .attr("class", "label")
            .text(node => node.data.name)
            .attr("text-anchor", "middle")
            .attr("font-size", 24)
            .attr("x", node => node.y)
            .attr("y", node => node.x - 10);
    });

    const closePanel = (e) => {
        if (e.target.className === 'backdrop') {
            props.showTheBox();
        }
    }

    return (
        <div className='backdrop' onClick={closePanel}>
            <div className='treePanel'>
                <svg ref={svgRef} style={{ paddingBlockStart: '2em' }}></svg>
            </div>
        </div>
    );
}