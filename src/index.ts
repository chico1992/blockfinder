import * as fs from "fs/promises"
import path from "path"
import * as nbt from 'prismarine-nbt'

async function main(folder: string, block: string) {
  console.log(block)
    const files = await fileList(folder)
    for (const file of files) {
      const res = await fileIncludesBlock(file,block)
      if(res) {
        console.log(file)
      }
    }
}

async function fileIncludesBlock(file: string, block: string) {
  const buffer = await fs.readFile(file)
    const { parsed } = await nbt.parse(buffer)
    const palette: Array<{Name: string}> = nbt.simplify(parsed).palette
    const blocks = palette.map(({Name}) => { 
        return Name
    });

    return blocks.includes(block)
}

async function fileList(dir: string): Promise<any> {
  const files = await fs.readdir(dir);
  const allFiles = await Promise.all(files.map(async ( file) =>  {
    const name = path.join(dir, file);
    const isDir = (await fs.stat(name)).isDirectory();
    if(isDir) {
      return  await fileList(name);
    }
    return name;
  }))
  return allFiles.flat();
}

main('nbt-files',"minecraft:chorus_plant")