
const appointment = Appointment.create(
    AppointmentId.create(1),
    AppointmentDate.create(new Date("02/02/2002")),
    AppointmentDescription.create("Cita numero 1 con el doctor John"),
    AppointmentDuration.create(2),
    AppointmentStatus.REQUESTED,
    AppointmentType.INPERSON,
    AppointmentPatient.create(PatientId.create(1)),
    AppointmentDoctor.create(DoctorId.create(1), DoctorSpecialtyEnum.CARDIOLOGY),
);

console.log(appointment.pullEvents());

