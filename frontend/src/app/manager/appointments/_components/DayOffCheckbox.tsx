// "use client";

// // import { turnTodayOff } from "@/actions/cabinets/turnTodayOff";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useState } from "react";
// import { toast } from "sonner";


// interface props {
//     todayOff: Date | null ,
//     cabinetId:string
// }

// export const DayOffCheckbox = ({ todayOff ,cabinetId}: props) => {
   
//   const [isDayOff, setIsDayOff] = useState(todayOff?.getDay() === new Date().getDay() ? true :  false);

//   const handleCheckboxChange = async() => {
//     setIsDayOff((prev) => !prev);
//     const res = await turnTodayOff({isDayOff,cabinetId})
//     if(res.success){
//         toast.success(res.success)
//     }
//     else if(res.warning){
//         toast.warning(res.warning)
//     }
//     else if(res?.error){
//         toast.error(res.error)
//     }
//   };

//   return (
//     <div className="items-top flex space-x-2 my-10">
//       <Checkbox id="day" checked={isDayOff} onCheckedChange={handleCheckboxChange} />
//       <div className="grid gap-1.5 leading-none">
//         <label
//           htmlFor="day"
//           className="text-sm font-medium text-red-500 peer-checked:text-neutral-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//         >
//           Turn off appointments today
//         </label>
//         <p className="text-sm text-muted-foreground peer-checked:text-neutral-200">
//           Stop patients from scheduling appointments for today
//         </p>
//       </div>
//     </div>
//   );
// };
