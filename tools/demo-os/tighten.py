# Fit each beat to its spoken line, render without captions, lay the voiceover on the actual beat starts.
import subprocess, sys, re
niche, page, src, sil, clauses = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], list(map(int, sys.argv[5].split(',')))
NAT = {'gym':[3.91,5.41,8.14,4.81,3.71,5.27,9.84,7.24,8.61,2.77],
       'eyecare':[3.91,5.41,8.14,4.81,3.67,5.27,9.84,7.24,8.61,2.77],
       'mechanical':[3.91,5.41,8.14,4.81,6.17,5.11,9.64,7.24,8.61,2.77]}[niche]
D = 'vo/'
DUR=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",D+src]))
ev=[(l.split(':')[0], float(l.split(':')[1])) for l in open(D+sil)]
segs=[]; cur=0.0
for k,v in ev:
    if k=='silence_start': segs.append((cur,v))
    else: cur=v
if cur<DUR-0.05: segs.append((cur,DUR))
segs=[s for s in segs if s[1]-s[0]>0.12]
assert len(segs)==sum(clauses)
lines=[]; i=0
for c in clauses:
    lines.append((max(0,segs[i][0]-0.06), min(DUR,segs[i+c-1][1]+0.12))); i+=c
LEAD=[0.4]+[0.25]*9; GAP=0.35; MAXSPD=1.4
beats=[]; speeds=[]
for j,(a,b) in enumerate(lines):
    target = LEAD[j] + (b-a) + (0.9 if j==9 else GAP)
    beat = max(target, NAT[j]/MAXSPD)
    spd = max(1.0, NAT[j]/beat)
    beats.append(round(beat,2)); speeds.append(round(spd,3))
env = dict(**__import__('os').environ, BEATS=','.join(map(str,beats)), SPEEDS=','.join(map(str,speeds)), NOCAP='1')
log = subprocess.run(["node","render-tour-clean.js",page,niche+"-tight",niche], env=env, capture_output=True, text=True).stdout
done = [float(x) for x in re.findall(r"beat \d+ done @ ([0-9.]+)s", log)]
print([l for l in log.splitlines() if 'OVERRAN' in l or 'video audit' in l])
starts=[0.0]+done[:-1]; total=done[-1]
subprocess.run(["ffmpeg","-v","error","-y","-framerate","30","-i",f"frames-{niche}-tight/f%05d.jpg","-c:v","libx264","-preset","slow","-crf","21","-pix_fmt","yuv420p","-movflags","+faststart",f"{niche}-tight-silent.mp4"],check=True)
parts=[]; mix=[]
for j,(a,b) in enumerate(lines):
    d=int((starts[j]+LEAD[j])*1000)
    parts.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={b-a-0.06:.3f}:d=0.06,adelay={d}|{d}[s{j}]"); mix.append(f"[s{j}]")
    print(f"  line {j+1:2d}: beat {starts[j]:5.2f}s → {done[j]:5.2f}s ({done[j]-starts[j]:.2f}s), speech {b-a:.2f}s, motion {speeds[j]:.2f}×")
fc=";".join(parts)+";"+"".join(mix)+f"amix=inputs={len(lines)}:normalize=0,apad,atrim=end={total},loudnorm=I=-16:TP=-1.5:LRA=11[out]"
subprocess.run(["ffmpeg","-v","error","-y","-i",D+src,"-filter_complex",fc,"-map","[out]","-ar","48000","-ac","2",f"{niche}-tight.wav"],check=True)
subprocess.run(["ffmpeg","-v","error","-y","-i",f"{niche}-tight-silent.mp4","-i",f"{niche}-tight.wav","-map","0:v","-map","1:a","-c:v","copy","-c:a","aac","-b:a","192k","-shortest","-movflags","+faststart",f"{niche}-os-demo-voiceover.mp4"],check=True)
subprocess.run(["rm","-rf",f"frames-{niche}-tight"])
print(f"{niche}: {total:.1f}s total")
