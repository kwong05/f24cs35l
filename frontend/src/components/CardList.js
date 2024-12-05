import React from 'react';

function CardList({ waitlist }) {
    if (!waitlist) {
        return <div></div>;
    }

    const tableRows = waitlist.map((user, index) => (
        <tr key={index}>
            <td>{user}</td>
        </tr>
    ));

    return (
        <div className="card-list">
            {waitlist.toReversed().map((username, index) => (
                <div key={index} className="card-list-item">
                    {index+1}. {username}
                </div>
            ))}
        </div>
    );
}

export default CardList;