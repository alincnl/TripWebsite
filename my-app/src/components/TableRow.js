export default function TableRow() {
    return (
        <tr>
            {this.props.rowContent.map((val, rowID) => (
                <td key={rowID}>{val}</td>
            ))}
        </tr>
    )
}