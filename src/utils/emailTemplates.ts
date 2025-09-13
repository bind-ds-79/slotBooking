// export function customerEmailTemplate(name: string, start: string, end: string,userType:Object,otherType:Object) {
//   return `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <h2 style="color: #1E40AF;">Booking Confirmed ✅</h2>
//       <p>Hi ${name}, your slot is confirmed.</p>
//       <p>Start: ${new Date(start).toLocaleString()}<br/>
//          End: ${new Date(end).toLocaleString()}<br/>
    
//     </div>
//   `;
// }



// export function adminEmailTemplate(name: string, email: string, start: string, end: string) {
//   return `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <h2 style="color: #DC2626;">New Booking 🗓️</h2>
//       <p>Name: ${name}<br/>
//          Email: ${email}<br/>
//          Start: ${new Date(start).toLocaleString()}<br/>
//          End: ${new Date(end).toLocaleString()}</p>
//     </div>
//   `;
// }

///////////////


export function customerEmailTemplate(
  name: string,
  start: string,
  end: string,
  type: string,
  other?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #1E40AF;">Booking Confirmed ✅</h2>
      <p>Hi ${name}, your slot is confirmed.</p>
      <p>
        <strong>Start:</strong> ${new Date(start).toLocaleString()}<br/>
        <strong>End:</strong> ${new Date(end).toLocaleString()}<br/>
        <strong>Type:</strong> ${type === "other" ? other || "Other" : type}
      </p>
    </div>
  `;
}


export function adminEmailTemplate(
  name: string,
  email: string,
  start: string,
  end: string,
  type: string,
  other?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #DC2626;">New Booking 🗓️</h2>
      <p>
        <strong>Name:</strong> ${name}<br/>
        <strong>Email:</strong> ${email}<br/>
        <strong>Start:</strong> ${new Date(start).toLocaleString()}<br/>
        <strong>End:</strong> ${new Date(end).toLocaleString()}<br/>
        <strong>Type:</strong> ${type === "other" ? other || "Other" : type}
      </p>
    </div>
  `;
}
