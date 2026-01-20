import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase';

async function hashAdmins() {
  const { data: admins } = await supabase
    .from('admin_users')
    .select('id, password');

  for (const admin of admins) {
    // Skip already-hashed passwords
    if (admin.password.startsWith('$2')) continue;

    const hash = await bcrypt.hash(admin.password, 12);

    await supabase
      .from('admin_users')
      .update({ password: hash })
      .eq('id', admin.id);
  }

  console.log('Passwords hashed');
}

hashAdmins();
