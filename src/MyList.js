import { AiFillEdit, AiFillDelete } from "react-icons/ai";
export const MyList = ({text,date, updatingInInput, deleteList}) => {
    return (
        <div>
            <p> {text} </p>
            <AiFillEdit onClick={updatingInInput} />
            <AiFillDelete onClick={deleteList} />
        </div>
    )
}