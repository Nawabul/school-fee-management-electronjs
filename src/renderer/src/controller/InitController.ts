class InitController {
  async database(): Promise<boolean> {
    const result = await window.init.database()
    console.log(result)
    if (!result.success) {
      return false
    }
    return true
  }
}

export default new InitController()
