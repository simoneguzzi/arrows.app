export const writeQueriesForAction = (action) => {
  switch (action.type) {
    case 'CREATE_CLUSTER': {
      console.log('creating cluster in db');

      return (session) =>
        session.run(
          `CREATE (n:Diagram0_Cluster {
        _id: $id, 
        _x: $x, 
        _y: $y,
        _caption: $caption,
        _type: $type,
        _members: $members,
        _xInitial: $xInitial,
        _yInitial: $yInitial
        })`,
          {
            id: action.nodeId,
            x: action.position.x,
            y: action.position.y,
            caption: action.caption,
            type: action.nodeType,
            members: action.members.map((member) => member.nodeId),
            xInitial: action.initialPosition.x,
            yInitial: action.initialPosition.y,
          }
        );
    }

    case 'MOVE_NODES_END_DRAG': {
      if (action.nodePositions.length !== 0) {
        return (session) => {
          let result = session;
          action.nodePositions.forEach(({ nodeId, position }) => {
            result = session.run(
              'MATCH (n:Diagram0_Cluster {_id: $id}) ' +
                'SET n._x = $x, n._y = $y',
              {
                id: nodeId,
                x: position.x,
                y: position.y,
              }
            );
          });
          return result;
        };
      }
      return () => Promise.resolve('Nothing to do');
    }

    case 'REMOVE_CLUSTER': {
      console.log('removing cluster from db');
      return (session) =>
        session.run(
          `MATCH (n:Diagram0_Cluster)
          WHERE n._id = $id
          DELETE n`,
          {
            id: action.nodeId,
          }
        );
    }

    default:
      return () => Promise.resolve('Nothing to do');
  }
};
