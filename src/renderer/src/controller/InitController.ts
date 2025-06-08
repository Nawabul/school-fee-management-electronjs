class InitController {
  async database(): Promise<boolean> {
    const result = await window.init.database()
    console.log(result)
    if (!result.success) {
      return false
    }
    return true
  }
  async monthly_fee(): Promise<boolean> {
    const result = await window.init.monthly_fee()
    console.log(result)
    if (!result.success) {
      return false
    }
    return true
  }
}

export default new InitController()
