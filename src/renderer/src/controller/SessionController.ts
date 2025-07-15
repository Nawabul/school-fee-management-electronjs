class SessionController {
  async check(): Promise<boolean> {
    const result = await window.session.check()

    if (!result.success) {
      return false
    }
    return result.data
  }
  async getEndMonth(): Promise<number> {
    const result = await window.session.getEndMonth()

    if (!result.success) {
      throw new Error('Session end error')
    }

    return result.data
  }
  async set(month: string | number): Promise<boolean> {
    const result = await window.session.set(month)

    if (!result.success) {
      return false
    }
    return true
  }
}

export default new SessionController()
