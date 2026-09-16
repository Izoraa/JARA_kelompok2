<h2>
    Progress Project
    {{ $project->name }}
</h2>


<h3>
    Total Task :
    {{ $total }}
</h3>


<h3>
    Selesai :
    {{ $done }}
</h3>


<h1>
    {{ $progress }} %
</h1>


<div style="
width:400px;
background:#ddd">

    <div style="
width:{{ $progress }}%;
background:green;
height:30px">

    </div>

</div>
