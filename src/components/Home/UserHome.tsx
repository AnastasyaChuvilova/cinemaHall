import {Schedule} from "../Schedule/Schedule.tsx";
import {DaysProvider} from "../../context/DaysContext.tsx";
export const UserHome = () => {

    return (
        <div>
            <DaysProvider>
                <Schedule/>
            </DaysProvider>
        </div>
    );
};
