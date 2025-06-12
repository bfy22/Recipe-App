const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: { type: Array, default: [] },
});

const User = mongoose.model('User', userSchema);