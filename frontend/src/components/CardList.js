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
        <table>
            <tbody>{tableRows}</tbody>
        </table>
    );
}

export default CardList;