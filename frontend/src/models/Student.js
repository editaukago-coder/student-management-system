export class Student {
  constructor({ id = null, nim, name, major, semester, email, phone, address, status }) {
    this.id = id
    this.nim = nim
    this.name = name
    this.major = major
    this.semester = Number(semester)
    this.email = email
    this.phone = phone
    this.address = address
    this.status = status
  }

  isValid() {
    return Boolean(
      this.nim?.trim() &&
      this.name?.trim() &&
      this.major?.trim() &&
      this.semester >= 1 &&
      this.semester <= 14 &&
      this.email?.includes('@') &&
      this.phone?.trim() &&
      this.address?.trim() &&
      this.status?.trim()
    )
  }

  toPayload() {
    return {
      nim: this.nim.trim(),
      name: this.name.trim(),
      major: this.major.trim(),
      semester: this.semester,
      email: this.email.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      status: this.status,
    }
  }
}
