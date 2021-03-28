mod api;

fn main() -> std::io::Result<()> {
    api::listen()
}
