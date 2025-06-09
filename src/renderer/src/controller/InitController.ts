class InitController {
  async database(): Promise<boolean> {
    const result = await window.init.database()

    if (!result.success) {
      return false
    }
    return true
  }
  async monthly_fee(): Promise<boolean> {
    const result = await window.init.monthly_fee()

    if (!result.success) {
      return false
    }
    return true
  }
}

export default new InitController()
